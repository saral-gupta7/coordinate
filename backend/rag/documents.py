from dataclasses import dataclass
from io import BytesIO

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from pypdf.errors import PdfReadError


class PdfIngestionError(ValueError):
    """Raised when an uploaded PDF cannot produce usable text."""


@dataclass(frozen=True)
class ExtractedPage:
    page_number: int
    text: str


@dataclass(frozen=True)
class ChunkPayload:
    page_number: int
    chunk_index: int
    content: str


def extract_pdf_pages(data: bytes, max_pages: int) -> list[ExtractedPage]:
    if not data.startswith(b"%PDF"):
        raise PdfIngestionError("The uploaded file is not a valid PDF.")

    try:
        reader = PdfReader(BytesIO(data))
    except (PdfReadError, ValueError, OSError) as exc:
        raise PdfIngestionError("The PDF could not be read.") from exc

    if reader.is_encrypted:
        try:
            unlocked = reader.decrypt("")
        except Exception as exc:  # pypdf exposes provider-specific errors here.
            raise PdfIngestionError("Password-protected PDFs are not supported.") from exc
        if not unlocked:
            raise PdfIngestionError("Password-protected PDFs are not supported.")

    if len(reader.pages) > max_pages:
        raise PdfIngestionError(
            f"PDFs are limited to {max_pages} pages for this course workspace."
        )

    pages: list[ExtractedPage] = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = "\n".join(part.strip() for part in (page.extract_text() or "").splitlines())
        text = text.strip()
        if text:
            pages.append(ExtractedPage(page_number=page_number, text=text))

    if not pages:
        raise PdfIngestionError(
            "No selectable text was found. OCR-only or scanned PDFs are not supported yet."
        )

    return pages


def chunk_pages(
    pages: list[ExtractedPage], chunk_size: int, chunk_overlap: int
) -> list[ChunkPayload]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    documents = [
        Document(page_content=page.text, metadata={"page_number": page.page_number})
        for page in pages
    ]
    split_documents = splitter.split_documents(documents)

    chunks: list[ChunkPayload] = []
    for chunk_index, document in enumerate(split_documents):
        content = document.page_content.strip()
        if not content:
            continue
        chunks.append(
            ChunkPayload(
                page_number=int(document.metadata["page_number"]),
                chunk_index=chunk_index,
                content=content,
            )
        )

    if not chunks:
        raise PdfIngestionError("The PDF did not contain enough text to index.")

    return chunks
