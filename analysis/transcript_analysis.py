import re
import json
import time
from ollama import Client
from collections import Counter
from typing import List, Dict

FILLER_PROMPT_TEMPLATE = """
You're given a portion of a spoken transcript. Identify only the **filler words and phrases** used in context (e.g., "um", "uh", "like", "you know", "I guess").
Return the results in the following JSON format:

[
  {{ "filler_phrases": ["um", "like", "sort of"] }}
]

If you find no filler words, return an empty list: []

Include no other text in your response or it'll affect my parsing of your response. Just include the list.

Transcript:
{text}
"""

client = Client()

def detect_filler_words_with_gpt(result: dict) -> list:
    all_words = result.get("segments")

    # Join words to make a full transcript
    full_transcript = "".join(word["text"] for word in all_words)

    #print(full_transcript)

    # Split the transcript into chunks based on sentence-terminating punctuation
    sentence_chunks = re.split(r'(?<=[.!?]) +', full_transcript)

    detected_fillers = []

    #print(sentence_chunks)

    i = 0
    while i < len(sentence_chunks):
        chunk = sentence_chunks[i]
        prompt = FILLER_PROMPT_TEMPLATE.format(text=chunk)

        # Send the chunk to Mistral for filler word detection
        response = client.chat(model="llama3", messages=[{"role": "user", "content": prompt}])

        print(response)

        try:
            chunk_result = json.loads(response.message.content.strip())
        except Exception as e:
            print(f"Failed to parse JSON from GPT response: {e}")
            i += 1
            continue # retry

        print(chunk_result)

        # Map the detected filler words to the corresponding timestamps in the transcript
        for entry in chunk_result:
            detected_fillers.extend(entry["filler_phrases"])

        i += 1
        time.sleep(1)
    
    print(detected_fillers)
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

    print(f"Word count: {word_count}")
    words_per_minute = (word_count / duration_sec) * 60
    return round(words_per_minute, 2)



def analyze_transcript(result: dict):
    return {
        "speech_rate_wpm": calculate_speech_rate(result),
        "filler_words": summarize_filler_word_counts(detect_filler_words_with_gpt(result))
    }
