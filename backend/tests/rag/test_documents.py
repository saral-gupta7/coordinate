import pytest

from rag.documents import ExtractedPage, PdfIngestionError, chunk_pages, extract_pdf_pages


def test_non_pdf_bytes_are_rejected() -> None:
    with pytest.raises(PdfIngestionError, match="not a valid PDF"):
        extract_pdf_pages(b"plain text", max_pages=10)


def test_chunking_preserves_page_metadata_and_stable_order() -> None:
    pages = [
        ExtractedPage(
            page_number=1,
            text="Retrieval augmented generation grounds model output. " * 35,
        ),
        ExtractedPage(
            page_number=2,
            text="Metadata filters keep private course sources isolated. " * 35,
        ),
    ]

    chunks = chunk_pages(pages, chunk_size=500, chunk_overlap=80)

    assert len(chunks) >= 4
    assert [chunk.chunk_index for chunk in chunks] == list(range(len(chunks)))
    assert {chunk.page_number for chunk in chunks} == {1, 2}
    assert all(chunk.content.strip() for chunk in chunks)
