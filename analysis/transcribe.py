# app.py
import shutil
import uuid
from pathlib import Path
from transcript_analysis import analyze_transcript

import os
from dotenv import load_dotenv

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from typing import List, Dict

import ffmpeg                  # ffmpeg-python wrapper
import whisper                 # OpenAI Whisper local
import httpx                   # for converting cloudinary URL; gemini does not take in URL directly

from google import genai
from google.genai.types import Part, GenerateContentConfig
import uvicorn
import json
import mimetypes

app = FastAPI()
model = whisper.load_model("small")   # or "base", "medium", "large"

# temporarily store uploaded videos in /tmp/uploads
UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# for Google Gemini API
PROJECT_ID = "publicspeaking-460317"
LOCATION = "us-central1"
GEMINI_PRO_MODEL_ID = "gemini-2.0-flash"

# load credentials from env file
load_dotenv()

@app.post("/analyze_transcript/")
async def upload_video(file: UploadFile = File(...)):
    # 1. Save uploaded video to disk
    file_id   = uuid.uuid4().hex
    video_path= UPLOAD_DIR / f"{file_id}{Path(file.filename).suffix}"
    with video_path.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    
    # 2. Extract audio → WAV @16 kHz mono
    audio_path = UPLOAD_DIR / f"{file_id}.wav"
    (
        ffmpeg
        .input(str(video_path))
        .output(
            str(audio_path),
            **{
                "vn": None,          # drop video
                "ac": 1,             # mono
                "ar": 16000,         # 16 kHz
                "f": "wav",          # format
                "acodec": "pcm_s16le" 
            }
        )
        .overwrite_output()
        .run(quiet=True)
    )

    # 3. Transcribe with Whisper
    result = model.transcribe(str(audio_path), language="en")
    transcript = result["text"].strip()

    # 4. (Optional) clean up files
    try:
        video_path.unlink()
        audio_path.unlink()
    except Exception:
        pass

    # 5. Get WPM and filler word count from transcript
    delivery_analysis = analyze_transcript(result)

    return JSONResponse({"transcript": transcript, "transcript_analysis": delivery_analysis})


# Content Analysis: Outline

# async def analyze_content_outline(outline: str, transcript: str):
#     """
#     Analyzes the content outline and transcript for coherence, flow, and engagement. Gives feedback to user on how
#     well what they are saying (the transcript) matches what they are trying to say (the outline).
#     """





## BODY LANGUAGE ANALYSIS APIS


def get_gemini_client():
    # Initialize the Gemini client (adjust auth if needed)
    return genai.Client(api_key = os.environ["GEMINI_API_KEY"])#, vertexai = True, project=PROJECT_ID, location=LOCATION)

video_analysis_response_schema = {
        "type": "OBJECT",
        "properties": {
            "pros": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "timestamp": {
                            "type": "STRING",
                            "description": "HH:MM:SS for display"
                        },
                        "description": {
                            "type": "STRING",
                            "description": "What nonverbal behavior is observed"
                        }
                    },
                    "required": ["timestamp", "description"]
                }
            },
            "cons": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "timestamp": {
                            "type": "STRING",
                            "description": "HH:MM:SS for display"
                        },
                        "description": {
                            "type": "STRING",
                            "description": "What nonverbal behavior is observed"
                        }
                    },
                    "required": ["timestamp", "description"]
                }
            }
        },
        "required": ["pros", "cons"]

}

# Prompt for analysis
video_analysis_prompt = (
    "You are a public speaking coach. Watch the entire video from start to finish and analyze the speaker’s nonverbal performance, focusing on:\n"
    "  • Body language (gestures, posture, movements)\n"
    "  • Eye contact\n"
    "  • Facial expressions (confidence vs. nervousness)\n\n"
    "Organize your feedback into two sections, summarizing common patterns into single bullets with multiple timestamps:\n\n"
    "Pros:\n"
    "  - [HH:MM:SS, HH:MM:SS, …]: Positive observation (e.g. open gestures, steady posture, confident smile)\n\n"
    "Cons:\n"
    "  - [HH:MM:SS, HH:MM:SS, …]: Area for improvement — explain what the speaker is doing wrong and why it matters (e.g. closed gestures, shaky posture, nervous smile)\n\n"
    "Requirements:\n"
    "  1. Cover the entire video, with at least one Pro and one Con for each minute of footage.\n"
    "  2. Every bullet must include its own timestamp(s)."
)

# Config for deterministic JSON output
json_config = GenerateContentConfig(
    temperature=0.0,
    max_output_tokens=8192,
    response_mime_type="application/json",
    response_schema=video_analysis_response_schema,
)

class VideoURLRequest(BaseModel):
    url: HttpUrl

@app.post("/analyze_body_language/")
# change so that this takes in a cloundinary URL, converts to a file, and then uploads to Gemini
#https://res.cloudinary.com/drg6bi879/video/upload/v1747867042/videoplayback_vrwez9.mp4
# ex. would take in a link like this
async def analyze_body_language_init(req: VideoURLRequest):
    # Fetch the video bytes from the Cloudinary URL
    url = str(req.url)
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(url)
    if resp.status_code != 200:
        raise HTTPException(400, f"Failed to fetch video from URL: {resp.status_code}")
    video_bytes = resp.content

    # 3) Pick a mime type (prefer the reported one, else guess from extension)
    mime_type = resp.headers.get("content-type")
    if not mime_type:
        mime_type, _ = mimetypes.guess_type(url)
        if not mime_type or not mime_type.startswith("video/"):
            mime_type = "application/octet-stream"


    # Call Gemini PRO
    client = get_gemini_client()
    try:
        response = client.models.generate_content(
            model=GEMINI_PRO_MODEL_ID,
            contents=[
                video_analysis_prompt,
                Part.from_bytes(data=video_bytes, mime_type= mime_type),
            ],
            config=json_config,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # 5) Unwrap the parsed result
    raw_wrapper = response.text

    try:
        wrapper = json.loads(raw_wrapper)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Could not parse outer JSON: {e}")
    
    return wrapper

video_improvement_prompt = """
You are a public speaking coach. First, read the previous feedback exactly as given below:
{feedback}

Then watch the entire new video from start to finish and identify only the specific improvements the speaker has made relative to that feedback. Focus on nonverbal performance (body language, eye contact, facial expressions, posture).

For each improvement, output an object with:
  - timestamp: one or more HH:MM:SS marks where that improvement occurs
  - time_seconds: the same offset(s) converted to seconds
  - description: what changed vs. last time and why it’s better

Organize your output as a JSON object named “improvements” like this:
{
  "improvements": [
    {
      "timestamp": "00:15, 00:45",
      "description": "Reduced hair-touching habit; hands now remain relaxed at sides."
    },
    {
      "timestamp": "01:10",
      "description": "Maintained steady eye contact for 3 seconds instead of looking down at notes."
    }
    // …
  ]
}
"""

@app.post("/analyze_body_language_improvement/")
# this function will compare the feedback given before and analyze what the speaker did
# better this time
# inputs would be the video URL and the previous feedback
async def analyze_body_language_improvement(req: VideoURLRequest, feedback: str):
    prompt = video_improvement_prompt.format(feedback=feedback)

    # Fetch the video bytes from the Cloudinary URL
    url = str(req.url)
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(url)
    if resp.status_code != 200:
        raise HTTPException(400, f"Failed to fetch video from URL: {resp.status_code}")
    video_bytes = resp.content

    # 3) Pick a mime type (prefer the reported one, else guess from extension)
    mime_type = resp.headers.get("content-type")
    if not mime_type:
        mime_type, _ = mimetypes.guess_type(url)
        if not mime_type or not mime_type.startswith("video/"):
            mime_type = "application/octet-stream"
    
    # Call Gemini PRO
    client = get_gemini_client()
    try:
        response = client.models.generate_content(
            model=GEMINI_PRO_MODEL_ID,
            contents=[
                prompt,
                Part.from_bytes(data=video_bytes, mime_type= mime_type),
            ],
            config=json_config,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # 5) Unwrap the parsed result
    raw_wrapper = response.text

    try:
        wrapper = json.loads(raw_wrapper)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Could not parse outer JSON: {e}")
    
    return wrapper
    

    


