from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    add_speech,
    add_rehearsal,
    connect_speech_rehearsal,
    delete_speech,
    retrieve_speeches,
    retrieve_speech,
)
from server.models.speech import (SpeechSchema,     ErrorResponseModel,
    ResponseModel,)
from server.models.rehearsal import RehearsalSchema

router = APIRouter()

@router.get("/{id}", response_description="Speech retrieved from the database")
async def get_speech_data(id: str):
    speech = await retrieve_speech(id)
    if speech:
        return ResponseModel(speech, "Speech successfully retrieved.")
    return ErrorResponseModel("An error occurred.", 404, "Speech not found")

@router.post("/", response_description="Speech added into the database")
async def add_speech_data(speech: SpeechSchema = Body(...), rehearsal: RehearsalSchema = Body(...)):
    speech_data = jsonable_encoder(speech)
    new_speech = await add_speech(speech_data)
    rehearsal_data = jsonable_encoder(rehearsal)
    new_rehearsal = await add_rehearsal(rehearsal_data)
    await connect_speech_rehearsal(new_speech["id"], new_rehearsal["id"])
    data = {
        "speech": new_speech,
        "rehearsal": new_rehearsal
    }
    return ResponseModel(data, "Speech added successfully.")

@router.delete("/{id}", response_description="Speech deleted from the database")
async def delete_speech_data(id: str):
    deleted = await delete_speech(id)
    if deleted:
        return ResponseModel({}, "Speech deleted successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Speech not found")

@router.get("/user/{id}", response_description="Speeches retrieved by user id from the database")
async def get_speeches_by_user(id: str):
    speeches = await retrieve_speeches(id)
    if speeches:    
        data = {
            "speeches": speeches
        }
        return ResponseModel(data, "Speeches successfully retrieved.")
    return ErrorResponseModel("An error occurred.", 404, "Speeches not found")
