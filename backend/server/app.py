from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routes.speech import router as SpeechRouter
from server.routes.rehearsal import router as RehearsalRouter

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(SpeechRouter, tags=["Speech"], prefix="/speech")
app.include_router(RehearsalRouter, tags=["Rehearsal"], prefix="/rehearsal")


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to this fantastic app!"}

