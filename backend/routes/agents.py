from fastapi import APIRouter
from uuid import uuid4
from agents.course_planner.graph import course_planner_graph
from agents.course_planner.schemas import (
    CourseCompletedStatus,
    CoursePlanRequest,
    CoursePlanResponse,
)

router = APIRouter(prefix="/internal/agents", tags=["agents"])


@router.post("/course-plan", response_model=CoursePlanResponse)
def course_planner_agent(request: CoursePlanRequest) -> CoursePlanResponse:
    result = course_planner_graph.invoke({"request": request, "trace": []})

    return CoursePlanResponse(
        agent_run_id=f"run_{uuid4().hex}",
        status=CourseCompletedStatus.COMPLETED,
        course=result["course_blueprint"],
        trace=result["trace"],
    )
