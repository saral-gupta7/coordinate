from .schemas import AgentStepStatus, AgentTraceStep
from .state import LessonBuilderState


def append_trace(
    state: LessonBuilderState,
    order: int,
    node_name: str,
    status: AgentStepStatus,
    summary: str | None = None,
) -> list[AgentTraceStep]:
    trace = state.get("trace", [])

    new_trace_step = AgentTraceStep(
        order=order,
        node_name=node_name,
        status=status,
        summary=summary,
    )

    return [*trace, new_trace_step]
