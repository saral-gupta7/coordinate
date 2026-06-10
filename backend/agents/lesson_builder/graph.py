from langgraph.graph import StateGraph, START, END

from .nodes import (
    draft_lesson_node,
    generate_quiz_node,
    prepare_context_node,
    prepare_response_node,
    review_lesson_node,
)
from .state import LessonBuilderState

graph = StateGraph(LessonBuilderState)

graph.add_node("prepare_context", prepare_context_node)
graph.add_node("draft_lesson", draft_lesson_node)
graph.add_node("generate_quiz", generate_quiz_node)
graph.add_node("review_lesson", review_lesson_node)
graph.add_node("prepare_response", prepare_response_node)

graph.add_edge(START, "prepare_context")
graph.add_edge("prepare_context", "draft_lesson")
graph.add_edge("draft_lesson", "generate_quiz")
graph.add_edge("generate_quiz", "review_lesson")
graph.add_edge("review_lesson", "prepare_response")
graph.add_edge("prepare_response", END)

lesson_builder_graph = graph.compile()
