from .state import CoursePlannerState
from .schemas import (
    AgentStepStatus,
    TopicValidationResult,
    LearnerProfile,
    CourseBlueprint,
    CurriculumReviewResult,
    CoursePlanResponse,
    CourseCompletedStatus,
)
from .trace import append_trace


from .llm import llm


def intake_node(state: CoursePlannerState) -> dict:
    request = state["request"]

    cleaned_topic = " ".join(request.topic.strip().split())
    return {
        "validated_topic": cleaned_topic,
        "trace": append_trace(
            order=1,
            node_name="intake",
            status=AgentStepStatus.COMPLETED,
            summary="Cleaned and normalized the course topic.",
            state=state,
        ),
    }


def validate_topic_node(state: CoursePlannerState) -> dict:
    request = state["request"]
    topic = state["validated_topic"]

    prompt = f"""
    You are validating a course topic.

    Topic: {topic}
    Goal: {request.goal}
    Experience level: {request.experience_level.value}
    Learning mode: {request.learning_mode}

    Decide whether this topic is valid for a course.
    If valid, refine it into a clear course topic.
    Explain the reason briefly.
    """

    structured_llm = llm.with_structured_output(TopicValidationResult)
    result = structured_llm.invoke(prompt)
    return {
        "validated_topic": result.refined_topic,
        "topic_validation": result,
        "trace": append_trace(
            order=2,
            state=state,
            node_name="validate_topic",
            status=AgentStepStatus.COMPLETED,
            summary=result.reason,
        ),
    }


def profile_learner_node(state: CoursePlannerState) -> dict:
    request = state["request"]
    topic = state["validated_topic"]
    topic_validation = state["topic_validation"]

    prompt = f"""
    You are creating a learner profile from the refined course topic.

    Validated Topic: {topic}
    Topic Is Valid: {topic_validation.is_valid}
    Topic Validation Reason: {topic_validation.reason}
    Goal: {request.goal}
    Experience level: {request.experience_level.value}
    Weekly Commitment: {request.weekly_commitment}
    Learning Mode: {request.learning_mode}
    Preferred Style: {request.preferred_style}

    Curate a best suited learner profile from the given information. Carefully design
    the curricullum based on the choices given for the best learning experience.
    Also explain the reason briefly.
    """
    structured_llm = llm.with_structured_output(LearnerProfile)
    result = structured_llm.invoke(prompt)

    return {
        "learner_profile": result,
        "trace": append_trace(
            order=3,
            state=state,
            node_name="profile_learner",
            status=AgentStepStatus.COMPLETED,
            summary=result.goal_summary,
        ),
    }


def plan_curriculum_node(state: CoursePlannerState) -> dict:
    request = state["request"]
    topic = state["validated_topic"]
    topic_validation = state["topic_validation"]
    learner_profile = state["learner_profile"]

    prompt = f"""
    You are defining a course blue print from the received learner profile.

    Course Title: {topic}
    Goal: {request.goal}
    Experience Level: {request.experience_level.value}
    Learning Mode: {request.learning_mode}
    Preferred Style: {request.preferred_style}
    Weekly Commitment: {request.weekly_commitment}
    Topic Validation Reason: {topic_validation.reason}
    Goal Summary: {learner_profile.goal_summary}
    Style Summary: {learner_profile.style_summary}
    Time Budget: {learner_profile.time_budget_summary}
    Planning Notes: {learner_profile.planning_notes}

    Based on the learner profile, curate a best suited course blue print.
    Also explain the reason briefly.
    """

    structured_llm = llm.with_structured_output(CourseBlueprint)
    result = structured_llm.invoke(prompt)

    return {
        "course_blueprint": result,
        "trace": append_trace(
            order=4,
            state=state,
            node_name="plan_curriculum",
            status=AgentStepStatus.COMPLETED,
            summary=f"Planned {len(result.chapters)} chapters.",
        ),
    }


def review_curriculum_node(state: CoursePlannerState) -> dict:
    request = state["request"]
    course_blueprint = state["course_blueprint"]
    learner_profile = state["learner_profile"]

    prompt = f"""
      You are reviewing a generated course blueprint before it is saved.

      Learner goal: {request.goal}
      Experience level: {request.experience_level.value}
      Preferred style: {request.preferred_style}
      Weekly commitment: {request.weekly_commitment}
      Learning mode: {request.learning_mode}

      Learner profile:
      {learner_profile.model_dump()}

      Course blueprint:
      {course_blueprint.model_dump()}

      Review whether this course is coherent, realistic, level-appropriate,
      well-sequenced, and aligned with the learner's goal.

      Return a strict review result.
    """

    structured_llm = llm.with_structured_output(CurriculumReviewResult)
    result = structured_llm.invoke(prompt)

    return {
        "curriculum_review": result,
        "review_passed": result.passed,
        "review_notes": result.revision_notes,
        "trace": append_trace(
            order=5,
            state=state,
            node_name="review_curriculum",
            status=AgentStepStatus.COMPLETED,
            summary=f"Review score: {result.score}/10. Passed: {result.passed}.",
        ),
    }


def prepare_response_node(state: CoursePlannerState) -> dict:
    course_blueprint = state["course_blueprint"]
    agent_run_id = state["agent_run_id"]

    updated_trace = append_trace(
        order=6,
        state=state,
        node_name="prepare_response",
        status=AgentStepStatus.COMPLETED,
        summary="Prepared the final course plan response.",
    )

    return {
        "final_response": CoursePlanResponse(
            agent_run_id=agent_run_id,
            status=CourseCompletedStatus.COMPLETED,
            course=course_blueprint,
            trace=updated_trace,
        ),
        "trace": updated_trace,
    }
