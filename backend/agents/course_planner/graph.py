from langgraph.graph import StateGraph, START, END
from .state import CoursePlannerState
from .nodes import (
    intake_node,
    validate_topic_node,
    profile_learner_node,
    plan_curriculum_node,
)

graph = StateGraph(CoursePlannerState)

graph.add_node("intake", intake_node)
graph.add_node("validate_topic", validate_topic_node)
graph.add_node("profile_learner", profile_learner_node)
graph.add_node("plan_curriculum", plan_curriculum_node)

graph.add_edge(START, "intake")
graph.add_edge("intake", "validate_topic")
graph.add_edge("validate_topic", "profile_learner")
graph.add_edge("profile_learner", "plan_curriculum")
graph.add_edge("plan_curriculum", END)


course_planner_graph = graph.compile()
