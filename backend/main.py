from fastapi import FastAPI, Response

app = FastAPI(title="Coordinate Backend")


@app.get("/")
def health_check():
    return {"status": "ok", "service": "coordinate api"}
