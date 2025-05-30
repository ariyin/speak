interface ProObservation {
  outline_point: string;
  timestamp: string; // Format: "HH:MM:SS"
  transcript_excerpt: string;
  suggestion: string;
}

interface ConObservation {
  outline_point: string;
  timestamp: string; // Format: "HH:MM:SS"
  issue: string;
  suggestion: string;
}

interface OutlineAnalysis {
  pros: ProObservation[];
  cons: ConObservation[];
}

interface ScriptObservation {
  script_excerpt: string;
  transcript_excerpt: string;
  timestamp: string; // Format: "HH:MM:SS"
  note: string;
}

interface ScriptAnalysis {
  omissions: ScriptObservation[];
  additions: ScriptObservation[];
  paraphrases: ScriptObservation[];
}

export interface ContentAnalysis {
  content_analysis?: OutlineAnalysis;
  script_analysis?: ScriptAnalysis;
}