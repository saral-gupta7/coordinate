from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime
from typing import Any

import psycopg
from pgvector import Vector
from pgvector.psycopg import register_vector
from psycopg.rows import dict_row

from .schemas import (
    KnowledgeDocumentResponse,
    KnowledgeDocumentStatus,
    RetrievedChunk,
)


class CourseNotFoundError(LookupError):
    pass


class DocumentNotFoundError(LookupError):
    pass


@dataclass(frozen=True)
class StoredChunk:
    id: str
    document_id: str
    user_id: str
    course_id: str
    filename: str
    page_number: int
    chunk_index: int
    content: str
    embedding: list[float]


class RagRepository:
    def __init__(self, database_dsn: str) -> None:
        self.database_dsn = database_dsn

    def _connect(self) -> psycopg.Connection[Any]:
        connection = psycopg.connect(
            self.database_dsn,
            connect_timeout=10,
            row_factory=dict_row,
        )
        register_vector(connection)
        return connection

    def assert_course_owned(self, user_id: str, course_id: str) -> None:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                'SELECT 1 FROM "Course" WHERE id = %s AND "userId" = %s',
                (course_id, user_id),
            )
            if cursor.fetchone() is None:
                raise CourseNotFoundError("Course not found.")

    def create_document(
        self,
        *,
        document_id: str,
        user_id: str,
        course_id: str,
        filename: str,
        mime_type: str,
        page_count: int,
    ) -> KnowledgeDocumentResponse:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO "KnowledgeDocument" (
                    id, "userId", "courseId", filename, "mimeType", status,
                    "pageCount", "chunkCount", "createdAt", "updatedAt"
                )
                VALUES (%s, %s, %s, %s, %s, 'PROCESSING', %s, 0, NOW(), NOW())
                RETURNING *
                """,
                (document_id, user_id, course_id, filename, mime_type, page_count),
            )
            return _document_from_row(cursor.fetchone())

    def store_chunks(
        self, *, document_id: str, chunks: Iterable[StoredChunk]
    ) -> KnowledgeDocumentResponse:
        chunk_list = list(chunks)
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.executemany(
                """
                INSERT INTO "KnowledgeChunk" (
                    id, "documentId", "userId", "courseId", filename,
                    "pageNumber", "chunkIndex", content, embedding, "createdAt"
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                [
                    (
                        chunk.id,
                        chunk.document_id,
                        chunk.user_id,
                        chunk.course_id,
                        chunk.filename,
                        chunk.page_number,
                        chunk.chunk_index,
                        chunk.content,
                        Vector(chunk.embedding),
                    )
                    for chunk in chunk_list
                ],
            )
            cursor.execute(
                """
                UPDATE "KnowledgeDocument"
                SET status = 'READY', "chunkCount" = %s, "errorMessage" = NULL,
                    "updatedAt" = NOW()
                WHERE id = %s
                RETURNING *
                """,
                (len(chunk_list), document_id),
            )
            return _document_from_row(cursor.fetchone())

    def mark_document_failed(
        self, *, document_id: str, message: str
    ) -> KnowledgeDocumentResponse | None:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE "KnowledgeDocument"
                SET status = 'FAILED', "errorMessage" = %s, "updatedAt" = NOW()
                WHERE id = %s
                RETURNING *
                """,
                (message[:1000], document_id),
            )
            row = cursor.fetchone()
            return _document_from_row(row) if row else None

    def list_documents(
        self, *, user_id: str, course_id: str
    ) -> list[KnowledgeDocumentResponse]:
        self.assert_course_owned(user_id, course_id)
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM "KnowledgeDocument"
                WHERE "userId" = %s AND "courseId" = %s
                ORDER BY "createdAt" DESC
                """,
                (user_id, course_id),
            )
            return [_document_from_row(row) for row in cursor.fetchall()]

    def delete_document(
        self, *, user_id: str, course_id: str, document_id: str
    ) -> None:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM "KnowledgeDocument"
                WHERE id = %s AND "userId" = %s AND "courseId" = %s
                RETURNING id
                """,
                (document_id, user_id, course_id),
            )
            if cursor.fetchone() is None:
                raise DocumentNotFoundError("Document not found.")

    def similarity_search(
        self,
        *,
        user_id: str,
        course_id: str,
        query_embedding: list[float],
        top_k: int,
        similarity_threshold: float,
    ) -> list[RetrievedChunk]:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    "documentId",
                    filename,
                    "pageNumber",
                    "chunkIndex",
                    content,
                    1 - (embedding <=> %(embedding)s) AS similarity
                FROM "KnowledgeChunk"
                WHERE "userId" = %(user_id)s
                  AND "courseId" = %(course_id)s
                  AND 1 - (embedding <=> %(embedding)s) >= %(threshold)s
                ORDER BY embedding <=> %(embedding)s
                LIMIT %(top_k)s
                """,
                {
                    "embedding": Vector(query_embedding),
                    "user_id": user_id,
                    "course_id": course_id,
                    "threshold": similarity_threshold,
                    "top_k": top_k,
                },
            )
            return [
                RetrievedChunk(
                    chunk_id=row["id"],
                    document_id=row["documentId"],
                    filename=row["filename"],
                    page_number=row["pageNumber"],
                    chunk_index=row["chunkIndex"],
                    content=row["content"],
                    similarity=float(row["similarity"]),
                )
                for row in cursor.fetchall()
            ]


def _document_from_row(row: dict[str, Any]) -> KnowledgeDocumentResponse:
    status = KnowledgeDocumentStatus(str(row["status"]).lower())
    created_at = row["createdAt"]
    updated_at = row["updatedAt"]
    if not isinstance(created_at, datetime) or not isinstance(updated_at, datetime):
        raise TypeError("Document timestamps must be datetime values.")
    return KnowledgeDocumentResponse(
        id=row["id"],
        course_id=row["courseId"],
        filename=row["filename"],
        mime_type=row["mimeType"],
        status=status,
        page_count=row["pageCount"],
        chunk_count=row["chunkCount"],
        error_message=row["errorMessage"],
        created_at=created_at,
        updated_at=updated_at,
    )
