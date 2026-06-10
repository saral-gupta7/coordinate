from enum import Enum
from pydantic import BaseModel, Field, field_validator


class AgentStepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    FAILED = "failed"
    COMPLETED = "completed"


class LessonCompletedStatus(str, Enum):
    FAILED = "failed"
    COMPLETED = "completed"


class AgentTraceStep(BaseModel):
    order: int
    node_name: str
    status: AgentStepStatus
    summary: str | None = None


class LessonBuildRequest(BaseModel):
    course_id: str = Field(min_length=1, max_length=120)
    chapter_id: str = Field(min_length=1, max_length=120)

    course_title: str = Field(min_length=2, max_length=140)
    course_description: str = Field(min_length=10, max_length=1200)
    course_goal: str | None = Field(default=None, max_length=500)
    experience_level: str = Field(min_length=2, max_length=80)
    learning_mode: str | None = Field(default=None, max_length=80)
    preferred_style: str | None = Field(default=None, max_length=80)
    final_project: str | None = Field(default=None, max_length=1200)

    chapter_title: str = Field(min_length=2, max_length=120)
    chapter_description: str = Field(min_length=10, max_length=800)
    chapter_order: int = Field(ge=1, le=30)
    learning_outcomes: list[str] = Field(default_factory=list, max_length=8)
    estimated_duration: int | None = Field(default=None, ge=5, le=600)

    @field_validator(
        "course_id",
        "chapter_id",
        "course_title",
        "course_description",
        "experience_level",
        "chapter_title",
        "chapter_description",
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


class LessonResource(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    type: str = Field(min_length=2, max_length=60)
    reason: str = Field(min_length=5, max_length=300)


class LessonCitation(BaseModel):
    label: str = Field(min_length=2, max_length=120)
    note: str = Field(min_length=5, max_length=300)


class QuizQuestion(BaseModel):
    question: str = Field(min_length=10, max_length=600)
    options: list[str] = Field(min_length=2, max_length=6)
    correct_answer_index: int = Field(ge=0, le=5)
    explanation: str = Field(min_length=10, max_length=600)
    concept: str = Field(min_length=2, max_length=120)


class LessonDraft(BaseModel):
    markdown_content: str = Field(min_length=500, max_length=20000)
    key_concepts: list[str] = Field(min_length=3, max_length=12)
    project_task: str | None = Field(default=None, max_length=1200)
    resources: list[LessonResource] = Field(default_factory=list, max_length=8)
    citations: list[LessonCitation] = Field(default_factory=list, max_length=8)


class LessonQuiz(BaseModel):
    questions: list[QuizQuestion] = Field(min_length=3, max_length=10)


class LessonReviewResult(BaseModel):
    passed: bool
    score: int = Field(ge=1, le=10)
    issues: list[str] = Field(default_factory=list, max_length=8)
    revision_notes: str | None = Field(default=None, max_length=1000)


class LessonBuildResponse(BaseModel):
    agent_run_id: str
    status: LessonCompletedStatus
    markdown_content: str | None = None
    quiz: LessonQuiz | None = None
    project_task: str | None = None
    resources: list[LessonResource] = Field(default_factory=list)
    citations: list[LessonCitation] = Field(default_factory=list)
    trace: list[AgentTraceStep]
