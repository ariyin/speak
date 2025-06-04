import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getCurrentRehearsal,
  getCurrentSpeech,
  deleteCurrentRehearsal,
  deleteSpeech,
} from "../utils/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

function ExitButton() {
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      const rehearsalId = getCurrentRehearsal();
      const speechId = getCurrentSpeech();

      if (!rehearsalId || !speechId) {
        throw new Error("No rehearsal or speech ID found");
      }

      // check if this is the first rehearsal
      const speechResponse = await axios.get(
        `http://localhost:8000/speech/${speechId}`,
      );

      const rehearsals = speechResponse.data.rehearsals;
      const isFirstRehearsal = rehearsals.length === 1;

      // always delete the current rehearsal
      const rehearsalDeleted = await axios.delete(
        `http://localhost:8000/rehearsal/${rehearsalId}`,
      );

      if (rehearsalDeleted.status === 200) {
        // remove from local storage
        deleteCurrentRehearsal();

        // only delete the speech if this is the first rehearsal
        if (isFirstRehearsal) {
          const speechDeleted = await axios.delete(
            `http://localhost:8000/speech/${speechId}`,
          );

          // remove from local storage
          if (speechDeleted.status === 200) {
            deleteSpeech(speechId);
          }
        }

        navigate("/");
      }
    } catch (error) {
      console.error("Error during exit:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-fit justify-self-end">exit</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>confirm exit</DialogTitle>
          <DialogDescription>
            are you sure you want to exit? your progress will not be saved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button onClick={handleExit}>exit</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExitButton;
