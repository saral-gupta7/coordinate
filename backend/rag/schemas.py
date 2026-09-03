from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class KnowledgeDocumentStatus(str, Enum):
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class KnowledgeDocumentResponse(BaseModel):
    id: str
    course_id: str
    filename: str
    mime_type: str
    status: KnowledgeDocumentStatus
    page_count: int
    chunk_count: int
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime


class RagSearchRequest(BaseModel):
    query: str = Field(min_length=3, max_length=600)
    top_k: int | None = Field(default=None, ge=1, le=12)

    @field_validator("query", mode="before")
    @classmethod
    def normalize_query(cls, value: object) -> object:
        if isinstance(value, str):
            return " ".join(value.strip().split())
        return value


class RetrievedChunk(BaseModel):
    chunk_id: str
    document_id: str
    filename: str
    page_number: int
    chunk_index: int
    content: str
    similarity: float

    @property
    def source_label(self) -> str:
        return f"{self.filename}, page {self.page_number}"


class RagSearchResponse(BaseModel):
    course_id: str
    query: str
    results: list[RetrievedChunk]
