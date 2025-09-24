# app.py
import shutil
from typing import Optional
import uuid
from pathlib import Path
from transcript_analysis import analyze_transcript

import os
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl

import ffmpeg                  # ffmpeg-python wrapper
import whisper                 # OpenAI Whisper local
import httpx                   # for converting cloudinary URL; gemini does not take in URL directly

from google import genai
from google.genai.types import Part, GenerateContentConfig
import uvicorn
import json
import mimetypes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("small")   # or "base", "medium", "large"

from prompts import (
    video_analysis_prompt,
    video_improvement_prompt
)

UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# for Google Gemini API
PROJECT_ID = "publicspeaking-460317"
LOCATION = "us-central1"
GEMINI_PRO_MODEL_ID = "gemini-2.0-flash"

# load credentials from env file
load_dotenv()

# analyze request schema
class AnalyzeRequest(BaseModel):
    video_url: HttpUrl
    outline: Optional[str] = None
    script: Optional[str] = None

def get_gemini_client():
    # Initialize the Gemini client (adjust auth if needed)
    return genai.Client(api_key = os.environ["GEMINI_API_KEY"])#, vertexai = True, project=PROJECT_ID, location=LOCATION)

def get_video_duration(file_path: str) -> float:
    """
    Returns the duration of a video (in seconds) using ffmpeg.probe.
    """
    try:
        probe = ffmpeg.probe(file_path)
        # streams[0] should be the first video or audio stream
        # 'format' always has duration at top level too
        duration = float(probe['format']['duration'])
        return duration
    except Exception as e:
        print(f"Could not get video duration: {e}")
        return 0.0

async def get_transcript_from_gemini(video_url: str) -> dict:
    """
    Download video and get a verbatim transcript (with filler words) from Gemini.
    """
    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(video_url)
    if resp.status_code != 200:
        raise HTTPException(400, f"Failed to fetch video: {resp.status_code}")
    video_bytes = resp.content

    mime_type = resp.headers.get("content-type")
    if not mime_type:
        mime_type, _ = mimetypes.guess_type(video_url)
        if not mime_type or not mime_type.startswith("video/"):
            mime_type = "application/octet-stream"

    transcript_prompt = """
        Transcribe the following video verbatim, including all filler words and pauses.
        Return only the transcript text, no commentary, no summarization.
        """

    client = get_gemini_client()
    response = client.models.generate_content(
        model=GEMINI_PRO_MODEL_ID,
        contents=[
            transcript_prompt,
            Part.from_bytes(data=video_bytes, mime_type=mime_type),
        ]
    )
    transcript_text = response.text.strip()

    return transcript_text

## CONTENT ANALYSIS
@app.post("/analyze_transcript/")
# takes in cloudinary URL, and gets transcript along with analysis
async def upload_video(req: AnalyzeRequest):
    # 1) Download video
    url = str(req.video_url)
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    if resp.status_code != 200:
        raise HTTPException(400, f"Failed to fetch video: {resp.status_code}")

    # 2) Save to temp file
    file_id = uuid.uuid4().hex
    suffix = Path(req.video_url.path).suffix or ".mp4"
    video_path = UPLOAD_DIR / f"{file_id}{suffix}"
    with open(video_path, "wb") as f:
        f.write(resp.content)

    # get video duration for speech rate
    duration_sec = get_video_duration(str(video_path))
    print(f"Video duration: {duration_sec} seconds")

    #get transcript from Gemini
    transcript = await get_transcript_from_gemini(url)
    # transcript = transcript.get("text", "").strip()
    print(transcript)

    # Clean up temp files
    try:
        video_path.unlink()
    except:
        pass

    # # 5. Get WPM and filler word count from transcript
    # delivery_analysis = analyze_transcript(result)

    # return JSONResponse({"transcript": transcript, "transcript_analysis": delivery_analysis})
    print("Video transcript gotten")
    analysis = analyze_transcript(
        transcript,
        outline=req.outline,
        script=req.script,
        duration_sec = duration_sec
    )

    return JSONResponse(analysis)

# CONTENT ANALYSIS APIS
   
## BODY LANGUAGE ANALYSIS APIS

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

# Config for deterministic JSON output
json_config = GenerateContentConfig(
    temperature=0.0,
    max_output_tokens=8192,
    response_mime_type="application/json",
    response_schema=video_analysis_response_schema,
)

## INITIAL BODY LANGUAGE ANALYSIS API
@app.post("/analyze_body_language/")
# change so that this takes in a cloundinary URL, converts to a file, and then uploads to Gemini
#https://res.cloudinary.com/drg6bi879/video/upload/v1747867042/videoplayback_vrwez9.mp4
# ex. would take in a link like this
async def analyze_body_language_init(req: AnalyzeRequest):
    # Fetch the video bytes from the Cloudinary URL
    url = str(req.video_url)
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


## IMPROVEMENT IN BODY ANALYSIS API
@app.post("/analyze_body_language_improvement/")
# this function will compare the feedback given before and analyze what the speaker did
# better this time
# inputs would be the video URL and the previous feedback
async def analyze_body_language_improvement(req: AnalyzeRequest, feedback: str):
    prompt = video_improvement_prompt.format(feedback=feedback)

    # Fetch the video bytes from the Cloudinary URL
    url = str(req.video_url)
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

    

    


