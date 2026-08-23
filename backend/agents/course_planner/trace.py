from .schemas import AgentStepStatus, AgentTraceStep
from .state import CoursePlannerState


def append_trace(
    state: CoursePlannerState,
    order: int,
    node_name: str,
    status: AgentStepStatus,
    summary: str | None = None,
) -> list[AgentTraceStep]:
    trace = state.get("trace", [])

    new_agent_trace = AgentTraceStep(
        order=order, node_name=node_name, status=status, summary=summary
    )

    return [*trace, new_agent_trace]
