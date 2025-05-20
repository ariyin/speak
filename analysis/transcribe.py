# app.py
import shutil
import uuid
from pathlib import Path
from transcript_analysis import analyze_transcript

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

import ffmpeg                  # ffmpeg-python wrapper
import whisper                 # OpenAI Whisper local

app = FastAPI()
model = whisper.load_model("small")   # or "base", "medium", "large"

# temporarily store uploaded videos in /tmp/uploads
UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/upload/")
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
