from core.llm import llm
from .schemas import (
    AgentStepStatus,
    LessonBuildResponse,
    LessonCompletedStatus,
    LessonDraft,
    LessonQuiz,
    LessonReviewResult,
)
from .state import LessonBuilderState
from .trace import append_trace


def prepare_context_node(state: LessonBuilderState) -> dict:
    request = state["request"]

    return {
        "trace": append_trace(
            state=state,
            order=1,
            node_name="prepare_context",
            status=AgentStepStatus.COMPLETED,
            summary=f"Prepared lesson context for chapter {request.chapter_order}: {request.chapter_title}.",
        )
    }


def draft_lesson_node(state: LessonBuilderState) -> dict:
    request = state["request"]

    prompt = f"""
    You are an expert instructional designer creating a production-ready
    lesson.

    Course:
    Title: {request.course_title}
    Description: {request.course_description}
    Goal: {request.course_goal}
    Experience level: {request.experience_level}
    Learning mode: {request.learning_mode}
    Preferred style: {request.preferred_style}
    Final project: {request.final_project}

    Chapter:
    Order: {request.chapter_order}
    Title: {request.chapter_title}
    Description: {request.chapter_description}
    Learning outcomes: {request.learning_outcomes}
    Estimated duration: {request.estimated_duration}

    Create a complete Markdown lesson for this chapter.

    Requirements:
    - Use clear headings.
    - Explain concepts step by step.
    - Include practical examples.
    - Include short checkpoints or reflection prompts.
    - Align with the learner's level and preferred style.
    - If useful, include a project task connected to the course final
    project.
    - Do not include quiz questions here.
    """

    structured_llm = llm.with_structured_output(LessonDraft)
    result = structured_llm.invoke(prompt)

    return {
        "lesson_draft": result,
        "trace": append_trace(
            state=state,
            order=2,
            node_name="draft_lesson",
            status=AgentStepStatus.COMPLETED,
            summary=f"Drafted lesson with {len(result.key_concepts)} key concepts.",
        ),
    }


def generate_quiz_node(state: LessonBuilderState) -> dict:
    request = state["request"]
    lesson_draft = state["lesson_draft"]

    prompt = f"""
      You are generating a quiz for a lesson.

      Course title: {request.course_title}
      Chapter title: {request.chapter_title}
      Chapter description: {request.chapter_description}
      Learning outcomes: {request.learning_outcomes}

      Lesson key concepts:
      {lesson_draft.key_concepts}

      Lesson content:
      {lesson_draft.markdown_content}

      Create a quiz that checks understanding of the most important concepts.

      Requirements:
      - Generate 3 to 6 multiple-choice questions.
      - Each question should have 4 options when possible.
      - correct_answer_index must point to the correct option.
      - Include a clear explanation for each answer.
      - Include the concept being tested.
      """

    structured_llm = llm.with_structured_output(LessonQuiz)
    result = structured_llm.invoke(prompt)

    return {
        "quiz": result,
        "trace": append_trace(
            state=state,
            order=3,
            node_name="generate_quiz",
            status=AgentStepStatus.COMPLETED,
            summary=f"Generated {len(result.questions)} quiz questions.",
        ),
    }


def review_lesson_node(state: LessonBuilderState) -> dict:
    request = state["request"]
    lesson_draft = state["lesson_draft"]
    quiz = state["quiz"]

    prompt = f"""
    You are reviewing a generated lesson before it is saved.

    Course title: {request.course_title}
    Chapter title: {request.chapter_title}
    Chapter description: {request.chapter_description}
    Experience level: {request.experience_level}
    Learning outcomes: {request.learning_outcomes}

    Lesson draft:
    {lesson_draft.model_dump()}

    Quiz:
    {quiz.model_dump()}

    Review whether the lesson is accurate, useful, level-appropriate,
    complete enough to study from, aligned with the chapter outcomes,
    and whether the quiz checks meaningful understanding.

    Return a strict review result.
    """

    structured_llm = llm.with_structured_output(LessonReviewResult)
    result = structured_llm.invoke(prompt)

    return {
        "lesson_review": result,
        "review_passed": result.passed,
        "review_notes": result.revision_notes,
        "trace": append_trace(
            state=state,
            order=4,
            node_name="review_lesson",
            status=AgentStepStatus.COMPLETED,
            summary=f"Review score: {result.score}/10. Passed: {result.passed}.",
        ),
    }


def prepare_response_node(state: LessonBuilderState) -> dict:
    agent_run_id = state["agent_run_id"]
    lesson_draft = state["lesson_draft"]
    quiz = state["quiz"]
    review_passed = state.get("review_passed", False)
    review_notes = state.get("review_notes")

    final_status = (
        LessonCompletedStatus.COMPLETED
        if review_passed
        else LessonCompletedStatus.FAILED
    )

    trace_status = (
        AgentStepStatus.COMPLETED if review_passed else AgentStepStatus.FAILED
    )

    summary = (
        "Prepared the final lesson response."
        if review_passed
        else f"Lesson failed review. {review_notes or 'No revision notes provided.'}"
    )

    updated_trace = append_trace(
        state=state,
        order=5,
        node_name="prepare_response",
        status=trace_status,
        summary=summary,
    )

    return {
        "final_response": LessonBuildResponse(
            agent_run_id=agent_run_id,
            status=final_status,
            markdown_content=lesson_draft.markdown_content if review_passed else None,
            quiz=quiz if review_passed else None,
            project_task=lesson_draft.project_task if review_passed else None,
            resources=lesson_draft.resources if review_passed else [],
            citations=lesson_draft.citations if review_passed else [],
            trace=updated_trace,
        ),
        "trace": updated_trace,
    }
