import re
import json
from json_repair import repair_json
import time
#from ollama import Client
from openai import OpenAI
from dotenv import load_dotenv
from collections import Counter
from typing import List, Dict, Optional

load_dotenv()

FILLER_PROMPT_TEMPLATE = """
You are given a portion of a spoken transcript. Your task is to extract only the **filler words or phrases** used in context.

Filler words are typically unnecessary pauses, hedges, or verbal crutches. Common examples include: "um", "uh", "like", "you know", "I guess", "so", "basically", "I mean", "sort of", etc.

Output a JSON list in the following format:

[
  {{ "filler_phrases": ["um", "like", "sort of", "yeah"] }}
]

If no filler words are found, return an empty list:
[]

Return **only** the JSON—no explanations, no additional text.

Transcript:
{text}
"""

from prompts import (
    content_analysis_outline_prompt,
    content_analysis_script_prompt
)

#client = Client()
client = OpenAI()

def detect_filler_words(result: dict) -> list:
    all_words = result.get("segments")

    # Join words to make a full transcript
    full_transcript = "".join(word["text"] for word in all_words)

    # Split the transcript into chunks based on sentence-terminating punctuation
    sentence_chunks = re.split(r'(?<=[.!?]) +', full_transcript)

    detected_fillers = []

    for i, chunk in enumerate(sentence_chunks):
        chunk = sentence_chunks[i]
        prompt = FILLER_PROMPT_TEMPLATE.format(text=chunk)

        # Send the chunk to Mistral for filler word detection
        #response = client.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
        # swap to gpt
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # or gpt-4o, gpt-3.5-turbo, etc.
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw_content = response.choices[0].message.content.strip()
        filler_word_dict = repair_json(raw_content)

        try:
            chunk_result = json.loads(filler_word_dict)
        except Exception as e:
            print(f"Failed to parse JSON from LLM response: {e}")
            continue # retry


        # Map the detected filler words to the corresponding timestamps in the transcript
        for entry in chunk_result:
            detected_fillers.extend(entry["filler_phrases"])

        time.sleep(0.3)
    
    return detected_fillers



def summarize_filler_word_counts(filler_words: List[Dict]) -> Dict[str, int]:
    """
    Takes a list of detected filler words with timestamps and returns a dictionary
    counting how many times each filler word occurred.
    """
    return dict(Counter(word.lower() for word in filler_words))



def calculate_speech_rate(result: dict) -> float:
    segments = []
    word_count = 0
    for segment in result.get("segments", []):
        segments.append(segment)
        word_count += len(segment["text"].strip().split())

    if not segments:
        return 0.0

    start_time = segments[0]["start"]
    end_time = segments[-1]["end"]
    duration_sec = end_time - start_time

    if duration_sec <= 0:
        return 0.0

    words_per_minute = (word_count / duration_sec) * 60
    return round(words_per_minute, 2)

# CONTENT ANALYSIS 

def analyze_content_outline(outline: str, transcript: List[List[str]]):
    """
    Analyzes the content outline and transcript for coherence, flow, and engagement. Gives feedback to user on how
    well what they are saying (the transcript) matches what they are trying to say (the outline).
    """
    prompt = content_analysis_outline_prompt.format(outline=outline, transcript=transcript)

    ## Feed into Llama 3 here
    #response = client.chat(model="llama3", messages=[{"role": "user", "content": prompt}])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    filtered_content = repair_json(response.choices[0].message.content)

    return json.loads(filtered_content)

def analyze_content_script(script: str, transcript: List[List[str]]):
    """
    Analyzes the content script and transcript for coherence, flow, and engagement. Gives feedback to user on how
    well what they are saying (the transcript) matches what they are supposed to say (the script).
    """
    prompt = content_analysis_script_prompt.format(script = script, transcript=transcript)

    ## Feed into Llama 3 here
    #response = client.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
    response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

    filtered_content = repair_json(response.choices[0].message.content)

    return json.loads(filtered_content)


def analyze_transcript(result: dict, outline: Optional[str] = None, script: Optional[str] = None, transcript: Optional[str] = None) -> dict:
    output = {
        "speech_rate_wpm": calculate_speech_rate(result),
        "filler_words": summarize_filler_word_counts(detect_filler_words(result))
    }

    if outline:
        output["content_analysis"] = analyze_content_outline(outline, [[segment["start"], segment["text"]] for segment in result["segments"]])
    if script:
        output["script_analysis"] = analyze_content_script(script, [[segment["start"], segment["text"]] for segment in result["segments"]])
    
    print(output)
    
    return output
