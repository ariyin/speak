# app.py
import shutil
import uuid
from pathlib import Path
from transcript_analysis import analyze_transcript

import os
from dotenv import load_dotenv

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict

import ffmpeg                  # ffmpeg-python wrapper
import whisper                 # OpenAI Whisper local

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
                        "time_seconds": {
                            "type": "NUMBER",
                            "description": "Offset in seconds from start of video"
                        },
                        "description": {
                            "type": "STRING",
                            "description": "What nonverbal behavior is observed"
                        }
                    },
                    "required": ["timestamp", "time_seconds", "description"]
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
                        "time_seconds": {
                            "type": "NUMBER",
                            "description": "Offset in seconds from start of video"
                        },
                        "description": {
                            "type": "STRING",
                            "description": "What nonverbal behavior is observed"
                        }
                    },
                    "required": ["timestamp", "time_seconds", "description"]
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

@app.post("/analyze_body_language/")
async def analyze_video(file: UploadFile = File(...)):
    # 1) Validate it’s a video of any format
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type; only video/* is supported.")

    # 2) Read bytes
    video_bytes = await file.read()

    # 3) Pick a mime type (prefer the reported one, else guess from extension)
    mime_type = file.content_type
    if not mime_type:
        mime_type, _ = mimetypes.guess_type(file.filename)
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
    
    # try:
    #     wrapper = response.json()
    #     text_str = wrapper.get("candidates", [])[0]["content"]["parts"][0]["text"]
    #     analysis = json.loads(text_str)
    # except Exception:
    #     # Fallback: if already structured
    #     analysis = wrapper

    # # Return JSON for front-end
    # return analysis

    # 5) Unwrap the parsed result
    raw_wrapper = response.text
    #print(raw_wrapper)

    try:
        wrapper = json.loads(raw_wrapper)
    except json.JSONDecodeError as e:
        raise HTTPException(500, f"Could not parse outer JSON: {e}")
    
    return wrapper
    

    


