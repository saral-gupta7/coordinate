from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status

from core.config import Settings, get_settings
from core.security import VerifiedUser, verify_internal_request
from rag.documents import PdfIngestionError
from rag.repository import CourseNotFoundError, DocumentNotFoundError
from rag.schemas import (
    KnowledgeDocumentResponse,
    RagSearchRequest,
    RagSearchResponse,
)
from rag.service import RagService, RagUnavailableError, get_rag_service

router = APIRouter(prefix="/internal/rag", tags=["rag"])


def require_rag_service() -> RagService:
    try:
        return get_rag_service()
    except RagUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc


@router.post(
    "/courses/{course_id}/documents",
    response_model=KnowledgeDocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_course_document(
    course_id: str,
    file: UploadFile = File(...),
    user: VerifiedUser = Depends(verify_internal_request),
    settings: Settings = Depends(get_settings),
    service: RagService = Depends(require_rag_service),
) -> KnowledgeDocumentResponse:
    max_bytes = settings.rag_max_file_size_mb * 1024 * 1024
    data = await file.read(max_bytes + 1)
    if len(data) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"PDFs are limited to {settings.rag_max_file_size_mb} MB.",
        )
    try:
        return service.ingest_pdf(
            user_id=user.user_id,
            course_id=course_id,
            filename=file.filename or "course-source.pdf",
            mime_type=file.content_type or "application/pdf",
            data=data,
        )
    except CourseNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except PdfIngestionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get(
    "/courses/{course_id}/documents",
    response_model=list[KnowledgeDocumentResponse],
)
def list_course_documents(
    course_id: str,
    user: VerifiedUser = Depends(verify_internal_request),
    service: RagService = Depends(require_rag_service),
) -> list[KnowledgeDocumentResponse]:
    try:
        return service.list_documents(user_id=user.user_id, course_id=course_id)
    except CourseNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete(
    "/courses/{course_id}/documents/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_course_document(
    course_id: str,
    document_id: str,
    user: VerifiedUser = Depends(verify_internal_request),
    service: RagService = Depends(require_rag_service),
) -> Response:
    try:
        service.delete_document(
            user_id=user.user_id,
            course_id=course_id,
            document_id=document_id,
        )
    except DocumentNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/courses/{course_id}/search",
    response_model=RagSearchResponse,
)
def search_course_documents(
    course_id: str,
    request: RagSearchRequest,
    user: VerifiedUser = Depends(verify_internal_request),
    service: RagService = Depends(require_rag_service),
) -> RagSearchResponse:
    results = service.retrieve(
        user_id=user.user_id,
        course_id=course_id,
        query=request.query,
        top_k=request.top_k,
    )
    return RagSearchResponse(course_id=course_id, query=request.query, results=results)
