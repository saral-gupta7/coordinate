from dataclasses import dataclass, field

from langchain_core.embeddings import Embeddings

from core.config import Settings
from rag.documents import ChunkPayload, ExtractedPage
from rag.schemas import RetrievedChunk
from rag.service import RagService


class FakeEmbeddings(Embeddings):
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [[float(index % 7) / 7 for index in range(768)] for _ in texts]

    def embed_query(self, text: str) -> list[float]:
        return [0.5 for _ in range(768)]


@dataclass
class FakeRepository:
    owned: list[tuple[str, str]] = field(default_factory=list)
    created: dict | None = None
    stored_chunks: list = field(default_factory=list)
    search_args: dict | None = None

    def assert_course_owned(self, user_id: str, course_id: str) -> None:
        self.owned.append((user_id, course_id))

    def create_document(self, **kwargs):
        self.created = kwargs

    def store_chunks(self, *, document_id: str, chunks):
        self.stored_chunks = list(chunks)
        return {"document_id": document_id}

    def mark_document_failed(self, **kwargs):
        raise AssertionError(f"Unexpected ingestion failure: {kwargs}")

    def similarity_search(self, **kwargs):
        self.search_args = kwargs
        return [
            RetrievedChunk(
                chunk_id="chunk_1",
                document_id="doc_1",
                filename="notes.pdf",
                page_number=3,
                chunk_index=2,
                content="Grounded context",
                similarity=0.81,
            )
        ]


def settings() -> Settings:
    return Settings(
        app_env="test",
        fastapi_internal_token="test-token-that-is-at-least-32-characters",
        google_api_key="test-key",
        backend_cors_origins="http://localhost:3000",
        _env_file=None,
    )


def test_ingestion_scopes_every_stored_chunk(monkeypatch) -> None:
    repository = FakeRepository()
    service = RagService(
        repository=repository,  # type: ignore[arg-type]
        embeddings=FakeEmbeddings(),
        settings=settings(),
    )
    monkeypatch.setattr(
        "rag.service.extract_pdf_pages",
        lambda data, max_pages: [ExtractedPage(page_number=1, text="Source text")],
    )
    monkeypatch.setattr(
        "rag.service.chunk_pages",
        lambda pages, chunk_size, chunk_overlap: [
            ChunkPayload(page_number=1, chunk_index=0, content="Source text")
        ],
    )

    result = service.ingest_pdf(
        user_id="user_1",
        course_id="course_1",
        filename="../private-notes.pdf",
        mime_type="application/pdf",
        data=b"%PDF fake",
    )

    assert result["document_id"].startswith("doc_")
    assert repository.owned == [("user_1", "course_1")]
    assert repository.created is not None
    assert repository.created["filename"] == "private-notes.pdf"
    assert len(repository.stored_chunks) == 1
    chunk = repository.stored_chunks[0]
    assert chunk.user_id == "user_1"
    assert chunk.course_id == "course_1"
    assert len(chunk.embedding) == 768


def test_retrieval_forwards_tenant_filters_and_threshold() -> None:
    repository = FakeRepository()
    service_settings = settings()
    service = RagService(
        repository=repository,  # type: ignore[arg-type]
        embeddings=FakeEmbeddings(),
        settings=service_settings,
    )

    results = service.retrieve(
        user_id="user_1",
        course_id="course_1",
        query="How does grounded retrieval work?",
    )

    assert results[0].source_label == "notes.pdf, page 3"
    assert repository.search_args is not None
    assert repository.search_args["user_id"] == "user_1"
    assert repository.search_args["course_id"] == "course_1"
    assert repository.search_args["top_k"] == service_settings.rag_retrieval_k
    assert (
        repository.search_args["similarity_threshold"]
        == service_settings.rag_similarity_threshold
    )
