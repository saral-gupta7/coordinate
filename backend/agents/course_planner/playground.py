from .graph import course_planner_graph
from .schemas import CoursePlanRequest, ExperienceLevel


request = CoursePlanRequest(
    topic="Learning  langchain for noob       ",
    goal="Becoming stronger in langchain and langgraph",
    experience_level=ExperienceLevel.BEGINNER,
    preferred_style="project-based",
    weekly_commitment=3,
    learning_mode="skill-building",
)


result = course_planner_graph.invoke({"request": request, "trace": []})

print(result["course_blueprint"])
