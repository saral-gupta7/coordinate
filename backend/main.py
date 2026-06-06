from fastapi import FastAPI
from routes.agents import router as agent_router

app = FastAPI(title="Coordinate Backend")

app.include_router(agent_router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "coordinate api"}
