import openai
import re
import json
from collections import Counter
from typing import List, Dict

FILLER_PROMPT_TEMPLATE = """
You're given a portion of a spoken transcript. Identify only the **filler words** used in context (e.g., "um", "uh", "like", "you know", "I guess").
Return the results in the following JSON format:

[
  { "word": "um", "index": 0 },
  { "word": "like", "index": 5 }
]

Transcript:
{text}
"""

def detect_filler_words_with_gpt(result: dict) -> list:
    all_words = []
    for segment in result.get("segments", []):
        all_words.extend(segment.get("words", []))

    # Join words to make a full transcript
    full_transcript = " ".join(word["word"] for word in all_words)

    # Split the transcript into chunks based on sentence-terminating punctuation
    sentence_chunks = re.split(r'(?<=[.!?]) +', full_transcript)

    detected_fillers = []

    for chunk in sentence_chunks:
        prompt = FILLER_PROMPT_TEMPLATE.format(text=chunk)

        # Send the chunk to GPT for filler word detection
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes spoken transcripts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        try:
            chunk_result = json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Failed to parse JSON from GPT response: {e}")
            continue

        # Map the detected filler words to the corresponding timestamps in the transcript
        for entry in chunk_result:
            local_idx = entry.get("index")
            if local_idx is not None and 0 <= local_idx < len(all_words):
                word_info = all_words[local_idx]
                detected_fillers.append({
                    "word": word_info["word"],
                    "start": word_info["start"],
                    "end": word_info["end"],
                })

    return detected_fillers



def summarize_filler_word_counts(filler_words: List[Dict]) -> Dict[str, int]:
    """
    Takes a list of detected filler words with timestamps and returns a dictionary
    counting how many times each filler word occurred.
    """
    return dict(Counter(word_info["word"].lower() for word_info in filler_words))



def calculate_speech_rate(result: dict) -> float:
    all_words = []
    for segment in result.get("segments", []):
        all_words.extend(segment.get("words", []))

    if not all_words:
        return 0.0

    start_time = all_words[0]["start"]
    end_time = all_words[-1]["end"]
    duration_sec = end_time - start_time

    if duration_sec <= 0:
        return 0.0

    words_per_minute = (len(all_words) / duration_sec) * 60
    return round(words_per_minute, 2)



def analyze_transcript(result: dict):
    return {
        "speech_rate_wpm": calculate_speech_rate(result),
        "filler_words": summarize_filler_word_counts(detect_filler_words_with_gpt(result))
    }
