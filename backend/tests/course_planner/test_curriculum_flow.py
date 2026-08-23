import os

import pytest
from pydantic import ValidationError

os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("FASTAPI_INTERNAL_TOKEN", "test-token-that-is-at-least-32-characters")
os.environ.setdefault("GOOGLE_API_KEY", "test-key")
os.environ.setdefault("BACKEND_CORS_ORIGINS", "http://localhost:3000")

from agents.course_planner.graph import (  # noqa: E402
    route_after_curriculum_decision,
    route_after_curriculum_review,
    route_after_topic_validation,
)
from agents.course_planner.schemas import (  # noqa: E402
    CourseBlueprint,
    CoursePlanRequest,
    TopicValidationResult,
)


def course_blueprint() -> CourseBlueprint:
    return CourseBlueprint(
        title="Practical SQL",
        description="A practical introduction to querying real analytics datasets.",
        goal="Write useful analytics queries with confidence.",
        experience_level="beginner",
        course_depth="quick_start",
        prerequisites=[],
        learning_objectives=["Read and write foundational SQL queries."],
        assessment_plan=["Complete a query exercise after each chapter."],
        final_project="Analyze a small business dataset and summarize the findings.",
        chapters=[
            {
                "title": f"Chapter {index}",
                "description": "Learn and apply one focused part of the SQL workflow.",
                "order": index,
                "learning_outcomes": ["Apply the chapter concept in a query."],
                "estimated_duration": 30,
            }
            for index in range(1, 4)
        ],
    )


def test_initial_request_does_not_require_a_curriculum_decision() -> None:
    request = CoursePlanRequest(prompt="Teach me practical SQL for analytics.")

    assert request.current_course is None
    assert request.is_satisfied is None


def test_revision_requires_meaningful_feedback() -> None:
    with pytest.raises(ValidationError, match="Describe the curriculum changes"):
        CoursePlanRequest(
            prompt="Teach me practical SQL for analytics.",
            current_course=course_blueprint(),
            is_satisfied=False,
            feedback="no",
        )


def test_valid_curriculum_routes_to_plan_or_review() -> None:
    validation = TopicValidationResult(
        is_valid=True,
        refined_topic="Practical SQL",
        reason="The request names a meaningful, teachable skill.",
    )
    initial_state = {
        "request": CoursePlanRequest(prompt="Teach me practical SQL for analytics."),
        "topic_validation": validation,
    }
    review_state = {
        "request": CoursePlanRequest(
            prompt="Teach me practical SQL for analytics.",
            current_course=course_blueprint(),
            is_satisfied=True,
        ),
        "topic_validation": validation,
    }

    assert route_after_topic_validation(initial_state) == "plan_curriculum"
    assert route_after_topic_validation(review_state) == "load_curriculum"


def test_user_decision_routes_to_approval_or_revision() -> None:
    assert route_after_curriculum_decision({"user_satisfied": True}) == (
        "prepare_response"
    )
    assert route_after_curriculum_decision({"user_satisfied": False}) == (
        "revise_curriculum"
    )


def test_internal_review_revises_at_most_twice_before_preview() -> None:
    assert route_after_curriculum_review(
        {"review_passed": False, "revision_count": 1}
    ) == "revise_curriculum"
    assert route_after_curriculum_review(
        {"review_passed": False, "revision_count": 2}
    ) == "prepare_preview"
    assert route_after_curriculum_review(
        {"review_passed": True, "revision_count": 0}
    ) == "prepare_preview"
