from typing import NotRequired, TypedDict

from .schemas import (
    AgentTraceStep,
    CourseBlueprint,
    CourseIntent,
    CoursePlanRequest,
    CoursePlanResponse,
    CurriculumReviewResult,
    TopicValidationResult,
)


class CoursePlannerState(TypedDict):
    request: CoursePlanRequest
    course_intent: NotRequired[CourseIntent]
    validated_topic: NotRequired[str]
    topic_validation: NotRequired[TopicValidationResult]
    course_blueprint: NotRequired[CourseBlueprint]
    curriculum_review: NotRequired[CurriculumReviewResult]
    review_passed: NotRequired[bool]
    review_notes: NotRequired[str | None]
    revision_count: NotRequired[int]
    user_satisfied: NotRequired[bool]
    trace: NotRequired[list[AgentTraceStep]]
    final_response: NotRequired[CoursePlanResponse]
    agent_run_id: NotRequired[str]
    user_id: NotRequired[str]
    user_email: NotRequired[str | None]
