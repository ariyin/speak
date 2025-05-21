import type { Rehearsal } from "./rehearsalService";

export interface Speech {
  id: string;
  rehearsals: Rehearsal[];
}
