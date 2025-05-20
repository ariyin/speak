from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    update_rehearsal,
    add_rehearsal,
    retrieve_rehearsal,
    delete_rehearsal,
)

from server.models.rehearsal import UpdateRehearsalSchema, ResponseModel, ErrorResponseModel, RehearsalSchema

router = APIRouter()

@router.patch("/type/{id}", response_description="Rehearsal type updated")
async def update_rehearsal_type(id: str, req: UpdateRehearsalSchema = Body(...)):
    analysis_type = { "analysis": req.analysis}
    updated_rehearsal = await update_rehearsal(id, analysis_type)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated succesfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.patch("/content/{id}", response_description="Rehearsal content updated")
async def update_rehearsal_content(id: str, req: UpdateRehearsalSchema = Body(...)):
    content = { "content": req.content}
    updated_rehearsal = await update_rehearsal(id, content)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated succesfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.post("/", response_description="Rehearsal added into the database")
async def add_rehearsal_data(rehearsal: RehearsalSchema = Body(...)):
    rehearsal_data = jsonable_encoder(rehearsal)
    new_rehearsal = await add_rehearsal(rehearsal_data)
    return ResponseModel(new_rehearsal, "Rehearsal added successfully.")

@router.get("/{id}", response_description="Rehearsal fetched from the database")
async def get_rehearsal_data(id: str):
    new_rehearsal = await retrieve_rehearsal(id)
    return ResponseModel(new_rehearsal, "Rehearsal added successfully.")

@router.delete("/{id}", response_description="Rehearsal deleted from the database")
async def delete_rehearsal_data(id: str):
    deleted = await delete_rehearsal(id)
    if deleted:
        return ResponseModel({}, "Rehearsal deleted successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")
