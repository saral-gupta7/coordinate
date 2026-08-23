from typing import Literal

from langgraph.graph import END, START, StateGraph

from .nodes import (
    curriculum_decision_node,
    interpret_request_node,
    load_curriculum_node,
    plan_curriculum_node,
    prepare_preview_node,
    prepare_response_node,
    reject_invalid_node,
    revise_curriculum_node,
    review_curriculum_node,
    validate_topic_node,
)
from .state import CoursePlannerState


def route_after_topic_validation(
    state: CoursePlannerState,
) -> Literal["plan_curriculum", "load_curriculum", "reject_invalid"]:
    topic_validation = state["topic_validation"]

    if topic_validation.is_valid:
        if state["request"].current_course is not None:
            return "load_curriculum"
        return "plan_curriculum"

    return "reject_invalid"


def route_after_curriculum_decision(
    state: CoursePlannerState,
) -> Literal["prepare_response", "revise_curriculum"]:
    if state.get("user_satisfied", False):
        return "prepare_response"

    return "revise_curriculum"


def route_after_curriculum_review(
    state: CoursePlannerState,
) -> Literal["prepare_preview", "revise_curriculum"]:
    if state.get("review_passed", False) or state.get("revision_count", 0) >= 2:
        return "prepare_preview"

    return "revise_curriculum"


graph = StateGraph(CoursePlannerState)

graph.add_node("interpret_request", interpret_request_node)
graph.add_node("validate_topic", validate_topic_node)
graph.add_node("reject_invalid", reject_invalid_node)
graph.add_node("plan_curriculum", plan_curriculum_node)
graph.add_node("load_curriculum", load_curriculum_node)
graph.add_node("curriculum_decision", curriculum_decision_node)
graph.add_node("revise_curriculum", revise_curriculum_node)
graph.add_node("review_curriculum", review_curriculum_node)
graph.add_node("prepare_preview", prepare_preview_node)
graph.add_node("prepare_response", prepare_response_node)

graph.add_edge(START, "interpret_request")
graph.add_edge("interpret_request", "validate_topic")
graph.add_conditional_edges(
    "validate_topic",
    route_after_topic_validation,
    {
        "plan_curriculum": "plan_curriculum",
        "load_curriculum": "load_curriculum",
        "reject_invalid": "reject_invalid",
    },
)

graph.add_edge("reject_invalid", END)
graph.add_edge("plan_curriculum", "review_curriculum")
graph.add_edge("load_curriculum", "curriculum_decision")
graph.add_conditional_edges(
    "curriculum_decision",
    route_after_curriculum_decision,
    {
        "prepare_response": "prepare_response",
        "revise_curriculum": "revise_curriculum",
    },
)
graph.add_edge("revise_curriculum", "review_curriculum")
graph.add_conditional_edges(
    "review_curriculum",
    route_after_curriculum_review,
    {
        "prepare_preview": "prepare_preview",
        "revise_curriculum": "revise_curriculum",
    },
)
graph.add_edge("prepare_preview", END)
graph.add_edge("prepare_response", END)


course_planner_graph = graph.compile()
