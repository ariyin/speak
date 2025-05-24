from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from server.database import (
    update_rehearsal,
    add_rehearsal,
    retrieve_rehearsal,
    delete_rehearsal,
    connect_speech_rehearsal,
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

@router.patch("/video_url/{id}", response_description="Rehearsal video URL updated")
async def update_rehearsal_video_url(id: str, req: UpdateRehearsalSchema = Body(...)):
    video_data = {
        "videoUrl": req.videoUrl,
        "duration": req.duration
    }
    updated_rehearsal = await update_rehearsal(id, video_data)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated successfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.patch("/delivery_analysis/{id}", response_description="Rehearsal delivery analysis updated")
async def update_rehearsal_delivery_analysis(id: str, req: UpdateRehearsalSchema = Body(...)):
    delivery_analysis = { "deliveryAnalysis": req.deliveryAnalysis}
    updated_rehearsal = await update_rehearsal(id, delivery_analysis)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated succesfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.patch("/content_analysis/{id}", response_description="Rehearsal content analysis updated")
async def update_rehearsal_content_analysis(id: str, req: UpdateRehearsalSchema = Body(...)):
    content_analysis = { "contentAnalysis": req.contentAnalysis}
    updated_rehearsal = await update_rehearsal(id, content_analysis)
    if updated_rehearsal:
        res = { "response": "Rehearsal {} updated succesfully".format(id)}
        return ResponseModel(res, "Rehearsal updated successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.post("/", response_description="Rehearsal added into the database")
async def add_rehearsal_data(rehearsal: RehearsalSchema = Body(...)):
    rehearsal_data = jsonable_encoder(rehearsal)
    new_rehearsal = await add_rehearsal(rehearsal_data)
    await connect_speech_rehearsal(new_rehearsal["speech"], new_rehearsal["id"])
    data = {
        "rehearsal": new_rehearsal
    }
    return ResponseModel(data, "Rehearsal added successfully.")

@router.get("/{id}", response_description="Rehearsal fetched from the database")
async def get_rehearsal_data(id: str):
    rehearsal = await retrieve_rehearsal(id)
    if rehearsal:
        return ResponseModel(rehearsal, "Rehearsal fetched successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")

@router.delete("/{id}", response_description="Rehearsal deleted from the database")
async def delete_rehearsal_data(id: str):
    deleted = await delete_rehearsal(id)
    if deleted:
        return ResponseModel({}, "Rehearsal deleted successfully.")
    return ErrorResponseModel("An error occurred.", 404, "Rehearsal not found")
