from .state import CoursePlannerState
from .schemas import AgentStepStatus
from .trace import append_trace


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
