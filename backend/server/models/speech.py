from typing import List, Optional
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from pydantic import BaseModel, Field
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class SpeechSchema(BaseModel):
    userId: str = Field(...)
    rehearsals: List[PyObjectId] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UpdateSpeechSchema(BaseModel):
    userId: Optional[str] = None
    rehearsals: Optional[List[PyObjectId]] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}