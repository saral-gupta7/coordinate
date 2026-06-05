from langgraph.graph import StateGraph, START, END
from .state import CoursePlannerState
from .nodes import intake_node

graph = StateGraph(CoursePlannerState)

graph.add_node("intake", intake_node)

graph.add_edge(START, "intake")
graph.add_edge("intake", END)


course_planner_graph = graph.compile()
