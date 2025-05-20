from dotenv import load_dotenv
from bson.objectid import ObjectId
import motor.motor_asyncio
import os

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)


database = client.get_database("PublicSpeaking")
speech_collection = database.get_collection("speeches")
rehearsal_collection = database.get_collection("rehearsals")

# helpers

async def connect_speech_rehearsal(speech_id: str, rehearsal_id: str):
    await speech_collection.update_one({"_id": ObjectId(speech_id)}, {"$push": {"rehearsals": ObjectId(rehearsal_id)}})
    await rehearsal_collection.update_one({"_id": ObjectId(rehearsal_id)}, {"$set": {"speech": ObjectId(speech_id)}})

# speech
def speech_helper(speech) -> dict:
    return {
        "id": str(speech["_id"]),
        "userId": speech["userId"],
        "rehearsals": speech["rehearsals"],
    }

async def add_speech(speech_data: dict) -> dict:
    speech = await speech_collection.insert_one(speech_data)
    new_speech = await speech_collection.find_one({"_id": speech.inserted_id})
    return speech_helper(new_speech)

async def retrieve_speeches(user_id: str) -> list:
    speeches = []
    async for speech in speech_collection.find({"userId": user_id}):
        speeches.append(speech_helper(speech))
    return speeches

async def retrieve_speech(speech_id: str) -> dict:
    speech = speech_collection.find_one({"_id": ObjectId(speech_id)})
    if speech:
        return speech_helper(speech)
    return None

async def update_speech(speech_id: str, data: dict) -> bool:
    if len(data) < 1:
        return False
    speech = await speech_collection.find_one({"_id": ObjectId(speech_id)})
    if speech:
        updated_speech = await speech_collection.update_one({"_id": ObjectId(speech_id)}, {"$set": data})
        if updated_speech:
            return True
        return False

async def delete_speech(speech_id: str) -> bool:  
    speech = await speech_collection.find_one({"_id": ObjectId(speech_id)})
    if speech:
        await speech_collection.delete_one({"_id": ObjectId(speech_id)})
        return True
    return False

# rehearsal helpers

def rehearsal_helper(rehearsal) -> dict:
    return {
        "id": str(rehearsal["_id"]),
        "analysis": rehearsal["analysis"],
        "speech": str(rehearsal["speech"]),
        "videoUrl": rehearsal["videoUrl"],
    }

async def add_rehearsal(rehearsal_data: dict) -> dict:
    rehearsal = await rehearsal_collection.insert_one(rehearsal_data)
    new_rehearsal = await rehearsal_collection.find_one({"_id": rehearsal.inserted_id})
    return rehearsal_helper(new_rehearsal)

async def retrieve_rehearsals(speech_id: str) -> list:
    rehearsals = []
    async for rehearsal in rehearsal_collection.find({"speech": speech_id}):
        rehearsals.append(rehearsal_helper(rehearsal))
    return rehearsals

async def retrieve_rehearsal(rehearsal_id: str) -> dict:
    rehearsal = await rehearsal_collection.find_one({"_id": ObjectId(rehearsal_id)})
    if rehearsal:
        return rehearsal_helper(rehearsal)
    return None

async def update_rehearsal(rehearsal_id: str, data: dict) -> bool:
    if len(data) < 1:
        return False
    rehearsal = rehearsal_collection.find_one({"_id": ObjectId(rehearsal_id)})    
    if rehearsal:
        updated_rehearsal = rehearsal_collection.update_one({"_id": ObjectId(rehearsal_id)}, {"$set": data})
        if updated_rehearsal:
            return True
        return False
    
async def delete_rehearsal(rehearsal_id: str) -> bool:
    rehearsal = await rehearsal_collection.find_one({"_id": ObjectId(rehearsal_id)})
    if rehearsal:
        await rehearsal_collection.delete_one({"_id": ObjectId(rehearsal_id)})
        return True
    return False