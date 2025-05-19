from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    update_rehearsal,
)

from server.models.rehearsal import UpdateRehearsalSchema, ResponseModel, ErrorResponseModel

router = APIRouter()

@router.patch("/{id}", response_description="Rehearsal type updated")
async def update_rehearsal_type(id: str, req: UpdateRehearsalSchema = Body(...)):
    print(req)
    analysis_type = { "analysis": req.analysis}
    updated_rehearsal = await update_rehearsal(id, analysis_type)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated succesfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

