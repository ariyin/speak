from typing import List, Optional
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from pydantic import BaseModel, Field
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class SpeechSchema(BaseModel):
    userId: str = Field(...)
    name: str = Field(...)
    practiceTime: float = Field(default=0.0)  # total practice time in seconds
    rehearsals: List[PyObjectId] = []
    thumbnailUrl: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UpdateSpeechSchema(BaseModel):
    userId: Optional[str] = None
    name: Optional[str] = None
    practiceTime: Optional[float] = None
    rehearsals: Optional[List[PyObjectId]] = None
    thumbnailUrl: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        

def ResponseModel(data, message):
    data.update({"code": 200, "message": message})
    return data


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}