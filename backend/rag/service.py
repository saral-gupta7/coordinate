from functools import lru_cache
from pathlib import Path
from uuid import uuid4

from langchain_core.embeddings import Embeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from core.config import Settings, get_settings

from .documents import PdfIngestionError, chunk_pages, extract_pdf_pages
from .repository import RagRepository, StoredChunk
from .schemas import KnowledgeDocumentResponse, RetrievedChunk


class RagUnavailableError(RuntimeError):
    pass


class RagService:
    def __init__(
        self,
        *,
        repository: RagRepository,
        embeddings: Embeddings,
        settings: Settings,
    ) -> None:
        self.repository = repository
        self.embeddings = embeddings
        self.settings = settings

    def ingest_pdf(
        self,
        *,
        user_id: str,
        course_id: str,
        filename: str,
        mime_type: str,
        data: bytes,
    ) -> KnowledgeDocumentResponse:
        safe_filename = Path(filename).name.strip()
        if not safe_filename or not safe_filename.lower().endswith(".pdf"):
            raise PdfIngestionError("Only PDF course sources are supported.")

        self.repository.assert_course_owned(user_id, course_id)
        pages = extract_pdf_pages(data, max_pages=self.settings.rag_max_pdf_pages)
        chunks = chunk_pages(
            pages,
            chunk_size=self.settings.rag_chunk_size,
            chunk_overlap=self.settings.rag_chunk_overlap,
        )
        document_id = f"doc_{uuid4().hex}"
        self.repository.create_document(
            document_id=document_id,
            user_id=user_id,
            course_id=course_id,
            filename=safe_filename,
            mime_type=mime_type or "application/pdf",
            page_count=len(pages),
        )

        try:
            vectors = self.embeddings.embed_documents(
                [chunk.content for chunk in chunks]
            )
            if len(vectors) != len(chunks):
                raise RuntimeError("Embedding provider returned an incomplete batch.")
            if any(
                len(vector) != self.settings.embedding_dimensions
                for vector in vectors
            ):
                raise RuntimeError("Embedding dimensions do not match the pgvector schema.")

            stored_chunks = [
                StoredChunk(
                    id=f"chunk_{uuid4().hex}",
                    document_id=document_id,
                    user_id=user_id,
                    course_id=course_id,
                    filename=safe_filename,
                    page_number=chunk.page_number,
                    chunk_index=chunk.chunk_index,
                    content=chunk.content,
                    embedding=vector,
                )
                for chunk, vector in zip(chunks, vectors, strict=True)
            ]
            return self.repository.store_chunks(
                document_id=document_id, chunks=stored_chunks
            )
        except Exception as exc:
            self.repository.mark_document_failed(
                document_id=document_id, message=str(exc)
            )
            raise

    def retrieve(
        self,
        *,
        user_id: str,
        course_id: str,
        query: str,
        top_k: int | None = None,
    ) -> list[RetrievedChunk]:
        cleaned_query = " ".join(query.strip().split())
        if len(cleaned_query) < 3:
            return []
        query_embedding = self.embeddings.embed_query(cleaned_query)
        if len(query_embedding) != self.settings.embedding_dimensions:
            raise RuntimeError("Query embedding dimensions do not match the index.")
        return self.repository.similarity_search(
            user_id=user_id,
            course_id=course_id,
            query_embedding=query_embedding,
            top_k=top_k or self.settings.rag_retrieval_k,
            similarity_threshold=self.settings.rag_similarity_threshold,
        )

    def list_documents(
        self, *, user_id: str, course_id: str
    ) -> list[KnowledgeDocumentResponse]:
        return self.repository.list_documents(user_id=user_id, course_id=course_id)

    def delete_document(
        self, *, user_id: str, course_id: str, document_id: str
    ) -> None:
        self.repository.delete_document(
            user_id=user_id, course_id=course_id, document_id=document_id
        )


@lru_cache(maxsize=1)
def get_rag_service() -> RagService:
    settings = get_settings()
    if settings.database_dsn is None:
        raise RagUnavailableError(
            "DATABASE_URL is required for the course knowledge base."
        )
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.embedding_model,
        api_key=settings.google_api_key,
        output_dimensionality=settings.embedding_dimensions,
    )
    return RagService(
        repository=RagRepository(settings.database_dsn),
        embeddings=embeddings,
        settings=settings,
    )
