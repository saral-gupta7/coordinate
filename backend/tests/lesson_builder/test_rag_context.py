from agents.lesson_builder.nodes import format_retrieved_context
from rag.schemas import RetrievedChunk


def test_retrieved_context_exposes_inspectable_source_metadata() -> None:
    context = format_retrieved_context(
        [
            RetrievedChunk(
                chunk_id="chunk_1",
                document_id="doc_1",
                filename="database-notes.pdf",
                page_number=7,
                chunk_index=3,
                content="A transaction groups database operations atomically.",
                similarity=0.92,
            )
        ]
    )

    assert 'id="S1"' in context
    assert 'document_id="doc_1"' in context
    assert 'chunk_id="chunk_1"' in context
    assert 'filename="database-notes.pdf"' in context
    assert 'page="7"' in context
    assert "transaction groups database operations" in context
