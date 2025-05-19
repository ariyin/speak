from fastapi import FastAPI

from server.routes.speech import router as SpeechRouter

app = FastAPI()

app.include_router(SpeechRouter, tags=["Speech"], prefix="/speech")


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to this fantastic app!"}

