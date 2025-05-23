import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getCurrentRehearsal,
  getCurrentSpeech,
  deleteCurrentRehearsal,
  deleteSpeech,
} from "../utils/auth";

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
    <button onClick={handleExit} className="justify-self-end">
      exit
    </button>
  );
}

export default ExitButton;
