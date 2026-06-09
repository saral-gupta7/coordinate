from pydantic import BaseModel, Field, field_validator
from enum import Enum


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
    COMPLETED = "completed"


class CoursePlanRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=120)
    goal: str = Field(min_length=5, max_length=500)
    experience_level: ExperienceLevel
    preferred_style: str = Field(min_length=2, max_length=80)
    weekly_commitment: int = Field(ge=1, le=40)
    learning_mode: str = Field(min_length=2, max_length=80)

    @field_validator(
        "topic",
        "goal",
        "preferred_style",
        "learning_mode",
        mode="before",
    )
    @classmethod
    def strip_and_reject_blank(cls, value: str) -> str:
        if not isinstance(value, str):
            return value

        cleaned = " ".join(value.strip().split())

        if not cleaned:
            raise ValueError("Field cannot be blank.")

        return cleaned


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
    learning_mode: str = Field(min_length=2, max_length=80)
    preferred_style: str = Field(min_length=2, max_length=80)
    weekly_commitment: int = Field(ge=1, le=40)
    prerequisites: list[str] = Field(default_factory=list, max_length=12)
    learning_objectives: list[str] = Field(
        default_factory=list, min_length=1, max_length=12
    )
    assessment_plan: list[str] = Field(
        default_factory=list, min_length=1, max_length=12
    )
    final_project: str = Field(min_length=10, max_length=1200)
    chapters: list[ChapterPlan] = Field(min_length=3, max_length=12)


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


class LearnerProfile(BaseModel):
    level: ExperienceLevel
    goal_summary: str = Field(min_length=5, max_length=500)
    style_summary: str = Field(min_length=5, max_length=500)
    time_budget_summary: str = Field(min_length=5, max_length=500)
    learning_mode: str = Field(min_length=2, max_length=80)
    planning_notes: list[str] = Field(min_length=1, max_length=10)


class CurriculumReviewResult(BaseModel):
    passed: bool
    score: int = Field(ge=1, le=10)
    strengths: list[str] = Field(default_factory=list, max_length=8)
    issues: list[str] = Field(default_factory=list, max_length=8)
    revision_notes: str | None = Field(default=None, max_length=1000)
