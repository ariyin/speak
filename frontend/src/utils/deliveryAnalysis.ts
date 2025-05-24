interface FillerWords {
  [word: string]: number;
}

interface AnalysisDetails {
  speech_rate_wpm: number;
  filler_words: FillerWords;
}

interface TranscriptAnalysis {
  transcript: string;
  analysis: AnalysisDetails;
}

interface NonverbalObservation {
  timestamp: string; // Format: "HH:MM:SS"
  description: string;
}

interface BodyLanguageAnalysis {
  pros: NonverbalObservation[];
  cons: NonverbalObservation[];
}

export interface DeliveryAnalysis {
  transcript_analysis?: TranscriptAnalysis;
  body_language_analysis?: BodyLanguageAnalysis; // update when body language analysis is defined
}