from .state import CoursePlannerState
from .schemas import AgentStepStatus, AgentTraceStep

# this traces job is to track the working of AI agent and maintain a history sort of thingy.
# this history later will be shown in frontend as timeline.


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
