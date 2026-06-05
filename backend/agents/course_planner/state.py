from typing import TypedDict, NotRequired
from .schemas import CoursePlanRequest, CourseBlueprint, AgentTraceStep


class CoursePlannerState(TypedDict):
    request: CoursePlanRequest
    validated_topic: NotRequired[str]
    learner_profile: NotRequired[str]
    course_blueprint: NotRequired[CourseBlueprint]
    review_passed: NotRequired[bool]
    review_notes: NotRequired[str]
    trace: NotRequired[list[AgentTraceStep]]
