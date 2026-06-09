import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agents import router as agent_router

app = FastAPI(title="Coordinate Backend")

cors_origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)
origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(agent_router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "coordinate api"}
