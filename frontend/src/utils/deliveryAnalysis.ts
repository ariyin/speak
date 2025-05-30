interface FillerWords {
  [word: string]: number;
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
  speech_rate_wpm: number;
  filler_words: FillerWords;
  body_language_analysis: BodyLanguageAnalysis;
}