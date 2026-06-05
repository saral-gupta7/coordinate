from pydantic import BaseModel, Field
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
    topic: str
    goal: str
    experience_level: ExperienceLevel
    preferred_style: str
    weekly_commitment: int
    learning_mode: str


class ChapterPlan(BaseModel):
    title: str
    description: str
    order: int
    learning_outcomes: list[str]
    estimated_duration: int


class CourseBlueprint(BaseModel):
    title: str
    description: str
    goal: str
    experience_level: ExperienceLevel
    learning_mode: str
    preferred_style: str
    weekly_commitment: int
    prerequisites: list[str] = Field(default_factory=list)
    learning_objectives: list[str] = Field(default_factory=list)
    assessment_plan: list[str] = Field(default_factory=list)
    final_project: str
    chapters: list[ChapterPlan] = Field(default_factory=list)


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
