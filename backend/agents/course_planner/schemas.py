from enum import Enum

from pydantic import BaseModel, Field, field_validator, model_validator


class ExperienceLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class AgentStepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    FAILED = "failed"
    COMPLETED = "completed"


class CourseCompletedStatus(str, Enum):
    FAILED = "failed"
    AWAITING_REVIEW = "awaiting_review"
    COMPLETED = "completed"


class CourseDepth(str, Enum):
    QUICK_START = "quick_start"
    STANDARD = "standard"
    COMPREHENSIVE = "comprehensive"


class CourseIntent(BaseModel):
    topic: str = Field(min_length=2, max_length=120)
    goal: str = Field(min_length=5, max_length=500)
    experience_level: ExperienceLevel
    course_depth: CourseDepth
    assumptions: list[str] = Field(default_factory=list, max_length=5)


class ChapterPlan(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=10, max_length=800)
    order: int = Field(ge=1, le=30)
    learning_outcomes: list[str] = Field(min_length=1, max_length=8)
    estimated_duration: int = Field(ge=5, le=600)


class CourseBlueprint(BaseModel):
    title: str = Field(min_length=2, max_length=140)
    description: str = Field(min_length=20, max_length=1200)
    goal: str = Field(min_length=5, max_length=500)
    experience_level: ExperienceLevel
    course_depth: CourseDepth
    prerequisites: list[str] = Field(default_factory=list, max_length=12)
    learning_objectives: list[str] = Field(
        default_factory=list, min_length=1, max_length=12
    )
    assessment_plan: list[str] = Field(
        default_factory=list, min_length=1, max_length=12
    )
    final_project: str = Field(min_length=10, max_length=1200)
    chapters: list[ChapterPlan] = Field(min_length=3, max_length=12)


class CoursePlanRequest(BaseModel):
    prompt: str = Field(min_length=10, max_length=2000)
    current_course: CourseBlueprint | None = None
    feedback: str | None = Field(default=None, max_length=2000)
    is_satisfied: bool | None = None

    @field_validator("prompt", "feedback", mode="before")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        if not isinstance(value, str):
            return value

        return value.strip()

    @model_validator(mode="after")
    def validate_curriculum_decision(self) -> "CoursePlanRequest":
        if self.current_course is None:
            if self.feedback is not None or self.is_satisfied is not None:
                raise ValueError("A curriculum is required before it can be reviewed.")
            return self

        if self.is_satisfied is None:
            raise ValueError("A curriculum decision is required.")

        if not self.is_satisfied and (not self.feedback or len(self.feedback) < 5):
            raise ValueError("Describe the curriculum changes you want.")

        return self


class AgentTraceStep(BaseModel):
    order: int
    node_name: str
    status: AgentStepStatus
    summary: str | None


class CoursePlanResponse(BaseModel):
    agent_run_id: str
    status: CourseCompletedStatus
    course: CourseBlueprint | None
    trace: list[AgentTraceStep]


class TopicValidationResult(BaseModel):
    is_valid: bool
    refined_topic: str = Field(min_length=2, max_length=120)
    reason: str = Field(min_length=5, max_length=500)


class CurriculumReviewResult(BaseModel):
    passed: bool
    score: int = Field(ge=1, le=10)
    strengths: list[str] = Field(default_factory=list, max_length=8)
    issues: list[str] = Field(default_factory=list, max_length=8)
    revision_notes: str | None = Field(default=None, max_length=1000)
