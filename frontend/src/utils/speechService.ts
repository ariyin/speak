import type { Rehearsal } from "./rehearsalService";

export interface Speech {
  id: string;
  name: string;
  practiceTime: number;
  rehearsals: Rehearsal[];
}
