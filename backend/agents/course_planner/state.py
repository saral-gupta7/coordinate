from typing import TypedDict, NotRequired
from .schemas import (
    CoursePlanRequest,
    CourseBlueprint,
    AgentTraceStep,
    TopicValidationResult,
    LearnerProfile,
)


class CoursePlannerState(TypedDict):
    request: CoursePlanRequest
    validated_topic: NotRequired[str]
    topic_validation: NotRequired[TopicValidationResult]
    learner_profile: NotRequired[LearnerProfile]
    course_blueprint: NotRequired[CourseBlueprint]
    review_passed: NotRequired[bool]
    review_notes: NotRequired[str]
    trace: NotRequired[list[AgentTraceStep]]
