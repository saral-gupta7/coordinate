from fastapi import APIRouter, Depends, HTTPException
from core.security import verify_internal_request, VerifiedUser
from uuid import uuid4
from agents.course_planner.graph import course_planner_graph
from agents.course_planner.schemas import (
    CoursePlanRequest,
    CoursePlanResponse,
)

router = APIRouter(prefix="/internal/agents", tags=["agents"])


@router.post("/course-plan", response_model=CoursePlanResponse)
def course_planner_agent(
    request: CoursePlanRequest, user: VerifiedUser = Depends(verify_internal_request)
) -> CoursePlanResponse:
    agent_run_id = f"run_{uuid4().hex}"

    try:
        result = course_planner_graph.invoke(
            {
                "request": request,
                "trace": [],
                "agent_run_id": agent_run_id,
                "user_id": user.user_id,
                "user_email": user.user_email,
            }
        )

        return result["final_response"]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Course planner failed.",
                "agent_run_id": agent_run_id,
                "error": str(exc),
            },
        ) from exc
