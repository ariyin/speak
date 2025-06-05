from typing import List, Optional, Literal, Dict
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from pydantic import BaseModel, Field
from typing_extensions import Annotated
from datetime import datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

# returns today's date in MM/DD/YYYY format
def get_today_date() -> str:
    return datetime.now().strftime("%m/%d/%Y")

class RehearsalSchema(BaseModel):
    analysis: List[str] = []
    speech: PyObjectId
    videoUrl: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    duration: Optional[float] = None
    content: Optional[Dict[str, str]] = None
    contentAnalysis: Optional[Dict] = None
    deliveryAnalysis: Optional[Dict] = None
    date: str = Field(default_factory=get_today_date)  # will automatically set to today's date in MM/DD/YYYY format

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UpdateRehearsalSchema(BaseModel):
    analysis: Optional[List[str]] = None
    videoUrl: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    duration: Optional[float] = None
    content: Optional[Dict[str, str]] = None
    contentAnalysis: Optional[Dict] = None
    deliveryAnalysis: Optional[Dict] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

def ResponseModel(data, message):
    data.update({"code": 200, "message": message})
    return data


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}