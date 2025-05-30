content_analysis_outline_prompt = """
You are a public speaking expert. I will provide:

1. The speaker’s **content outline** (a list of points they intended to cover).  
2. The actual **transcript** of what they said, with timestamps.

Your task is for **each** outline point, determine whether and how the transcript addresses it.

- If the transcript **clearly covers** an outline point, add an entry to `pros`:
  • `outline_point`: the exact bullet from the outline  
  • `timestamp`: a single approximate MM:SS where they covered this point  
  • `transcript_excerpt`: the exact phrase or short section from the transcript that addresses it  
  • `suggestion`: (optional) how to deepen or clarify this coverage

- If the transcript **fails to cover** or only **briefly & weakly** covers an outline point, add an entry to `cons`:
  • `outline_point`: the exact bullet from the outline  
  • `timestamp`: if it appears briefly, the single MM:SS; otherwise "missing"  
  • `issue`: a brief note on why this point wasn’t fully addressed  
  • `suggestion`: how to better integrate or expand on this point

Return a JSON object with two arrays, `pros` and `cons`, for example:

```json
{{
  "pros": [
    {{
      "outline_point": "Introduce the company’s history",
      "timestamp": "02:15",
      "transcript_excerpt": "“We founded our startup in 2010 with a mission to...”",
      "suggestion": "Good start—perhaps add one anecdote for emotional impact."
    }}
  ],
  "cons": [
    {{
      "outline_point": "Explain the upcoming product roadmap",
      "timestamp": "missing",
      "issue": "This topic was not mentioned in the transcript.",
      "suggestion": "Add a section around minute 4 to cover the roadmap."
    }}
  ]
}}```

It is very important that timestamps be in MM:SS format, please follow this. It should be a single timestamp per pro or con, not a range.

Here are the inputs:

Content Outline:
{outline}

Transcript:
{transcript}
"""

content_analysis_script_prompt = """
You are a public speaking analyst. I will provide you with two pieces of text:

1. The speaker’s **original speech text** (the script or planned speech).  
2. The **transcript** of what they actually said in their delivery, with timestamps.

Your task is to compare them and identify all the meaningful differences:

• **Omissions**: sentences or key phrases present in the original script that did **not** appear in the delivered transcript.  
• **Additions**: sentences or phrases the speaker added that were **not** in the original script.  
• **Paraphrases**: places where the speaker covered the same idea but used different wording.

For each difference, output an object with:
  - `type`: one of `"omission"`, `"addition"`, or `"paraphrase"`  
  - `script_excerpt`: the exact text from the original script  
  - `transcript_excerpt`: the exact text from the delivered transcript (or `null` if omitted)  
  - `timestamp`: approximate MM:SS where the transcript_excerpt occurs (if available; otherwise `"n/a"`)  
  - `note`: a brief explanation of the difference  

Return a single JSON object with three arrays: `omissions`, `additions`, and `paraphrases`. For example:

```json
{{
  "omissions": [
    {{
      "script_excerpt": "“Today we'll discuss our company mission in depth.”",
      "transcript_excerpt": null,
      "timestamp": "n/a",
      "note": "This line was not said during the delivery."
    }}
  ],
  "additions": [
    {{
      "script_excerpt": null,
      "transcript_excerpt": "“Thank you all for being here today.”",
      "timestamp": "00:05",
      "note": "The speaker added an opening greeting."
    }}
  ],
  "paraphrases": [
    {{
      "script_excerpt": "“We achieved a 20 percent growth last quarter.”",
      "transcript_excerpt": "“Our numbers jumped by about one-fifth in the last three months.”",
      "timestamp": "03:15",
      "note": "Idea is the same but wording differs."
    }}
  ]
}}```

It is very important that timestamps be in MM:SS format, please follow this.

Here are the inputs:

Script:
{script}

Transcript:
{transcript}
"""



video_analysis_prompt = (
    "You are a public speaking coach. Watch the entire video from start to finish and analyze the speaker’s nonverbal performance, focusing on:\n"
    "  • Body language (gestures, posture, movements)\n"
    "  • Eye contact\n"
    "  • Facial expressions (confidence vs. nervousness)\n\n"
    "Organize your feedback into two sections, summarizing common patterns into single bullets with multiple timestamps:\n\n"
    "Pros:\n"
    "  - [MM:SS, MM:SS, …]: Positive observation (e.g. open gestures, steady posture, confident smile)\n\n"
    "Cons:\n"
    "  - [MM:SS, MM:SS, …]: Area for improvement — explain what the speaker is doing wrong and why it matters (e.g. closed gestures, shaky posture, nervous smile)\n\n"
    "Requirements:\n"
    "  1. Cover the entire video, with at least one Pro and one Con for each minute of footage.\n"
    "  2. Every bullet must include its own timestamp(s).\n"

    "It is very important that timestamps be in MM:SS format, please follow this."
)

video_improvement_prompt = """
You are a public speaking coach. First, read the previous feedback exactly as given below:
{feedback}

Then watch the entire new video from start to finish and identify only the specific improvements the speaker has made relative to that feedback. Focus on nonverbal performance (body language, eye contact, facial expressions, posture).

For each improvement, output an object with:
  - timestamp: one or more MM:SS marks where that improvement occurs
  - time_seconds: the same offset(s) converted to seconds
  - description: what changed vs. last time and why it’s better

Organize your output as a JSON object named “improvements” like this:
{{
  "improvements": [
    {{
      "timestamp": "00:15, 00:45",
      "description": "Reduced hair-touching habit; hands now remain relaxed at sides."
    }},
    {{
      "timestamp": "01:10",
      "description": "Maintained steady eye contact for 3 seconds instead of looking down at notes."
    }}
    // …
  ]
}}

It is very important that timestamps be in MM:SS format, please follow this.
"""

