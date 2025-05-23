content_analysis_prompt = """
You are a presentation design expert. I will provide:

1. The speaker’s **content outline** (what they intended to cover).  
2. The actual **transcript** of what they said.

Your task is to identify **specific phrases or sections** in the transcript that are either **effective** (pros) or **need improvement** (cons), and tie each back to the outline.  

For each **pro**, output an object with:
  • `phrase`: the exact excerpt from the transcript  
  • `timestamp`: approximate HH:MM:SS where it occurs (if available)  
  • `context`: how this phrase aligns with or enhances the outline  
  • `suggestion`: a quick tip on how to leverage or expand on this strength  

For each **con**, output an object with:
  • `phrase`: the exact excerpt from the transcript  
  • `timestamp`: approximate HH:MM:SS  
  • `context`: why this phrase diverges from or weakens the outline  
  • `suggestion`: a concrete, actionable tip to improve it  

Return your results as a single JSON object with two arrays, `pros` and `cons`, like this:

```json
{
  "pros": [
    {
      "phrase": "...",
      "timestamp": "00:02:15",
      "context": "Reinforces the key point about X in the outline",
      "suggestion": "Use more examples like this to strengthen your argument"
    },
    ...
  ],
  "cons": [
    {
      "phrase": "...",
      "timestamp": "00:03:40",
      "context": "Drifts away from the section on Y in the outline",
      "suggestion": "Tie this back to the outline by explicitly referencing Y"
    },
    ...
  ]

  Here are the inputs:
    1. Content Outline: {outline}
    2. Transcript: {transcript}
```
}
"""

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

