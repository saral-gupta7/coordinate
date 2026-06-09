from typing import TypedDict, NotRequired
from .schemas import (
    CoursePlanRequest,
    CourseBlueprint,
    AgentTraceStep,
    TopicValidationResult,
    LearnerProfile,
    CurriculumReviewResult,
    CoursePlanResponse,
)


class CoursePlannerState(TypedDict):
    request: CoursePlanRequest
    validated_topic: NotRequired[str]
    topic_validation: NotRequired[TopicValidationResult]
    learner_profile: NotRequired[LearnerProfile]
    course_blueprint: NotRequired[CourseBlueprint]
    curriculum_review: NotRequired[CurriculumReviewResult]
    review_passed: NotRequired[bool]
    review_notes: NotRequired[str]
    trace: NotRequired[list[AgentTraceStep]]
    final_response: NotRequired[CoursePlanResponse]
    agent_run_id: NotRequired[str]
    user_id: NotRequired[str]
    user_email: NotRequired[str | None]
