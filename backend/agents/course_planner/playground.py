import json
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

DIVIDER = "=" * 60


def print_stage(name: str, data: dict):
    print(f"\n{DIVIDER}")
    print(f"  STAGE: {name.upper()}")
    print(DIVIDER)
    for key, value in data.items():
        print(f"\n  [{key}]")
        if isinstance(value, str):
            print(f"  {value}")
        else:
            try:
                print(
                    json.dumps(
                        value
                        if not hasattr(value, "model_dump")
                        else value.model_dump(),
                        indent=4,
                    )
                )
            except Exception:
                print(f"  {value}")


print(f"\n{'=' * 60}")
print("  STREAMING GRAPH EXECUTION")
print(f"{'=' * 60}")

for step in course_planner_graph.stream({"request": request, "trace": []}):
    for node_name, state_update in step.items():
        print_stage(node_name, state_update)

print(f"\n{DIVIDER}")
print("  DONE")
print(DIVIDER)
