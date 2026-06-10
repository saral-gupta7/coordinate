from typing import NotRequired, TypedDict
from .schemas import (
    AgentTraceStep,
    LessonBuildRequest,
    LessonBuildResponse,
    LessonDraft,
    LessonQuiz,
    LessonReviewResult,
)


class LessonBuilderState(TypedDict):
    request: LessonBuildRequest
    lesson_draft: NotRequired[LessonDraft]
    quiz: NotRequired[LessonQuiz]
    lesson_review: NotRequired[LessonReviewResult]
    review_passed: NotRequired[bool]
    review_notes: NotRequired[str | None]
    final_response: NotRequired[LessonBuildResponse]
    trace: NotRequired[list[AgentTraceStep]]
    agent_run_id: NotRequired[str]
    user_id: NotRequired[str]
    user_email: NotRequired[str | None]
