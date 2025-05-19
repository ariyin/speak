from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    add_speech,
    add_rehearsal,
    connect_speech_rehearsal,
)
from server.models.speech import (SpeechSchema,     ErrorResponseModel,
    ResponseModel,)
from server.models.rehearsal import RehearsalSchema

router = APIRouter()

@router.post("/", response_description="Speech added into the database")
async def add_speech_data(speech: SpeechSchema = Body(...), rehearsal: RehearsalSchema = Body(...)):
    speech_data = jsonable_encoder(speech)
    new_speech = await add_speech(speech_data)
    rehearsal_data = jsonable_encoder(rehearsal)
    new_rehearsal = await add_rehearsal(rehearsal_data)
    await connect_speech_rehearsal(new_speech["id"], new_rehearsal["id"])
    return ResponseModel(new_speech, "Speech added successfully.")

