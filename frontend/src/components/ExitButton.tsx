import { useState, useEffect } from "react";
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
  const [isFirstRehearsal, setIsFirstRehearsal] = useState(false);

  useEffect(() => {
    const checkRehearsalCount = async () => {
      try {
        const speechId = getCurrentSpeech();
        if (!speechId) return;

        const response = await axios.get(
          `http://localhost:8000/speech/${speechId}`,
        );
        const rehearsals = response.data.rehearsals;
        setIsFirstRehearsal(rehearsals.length === 1);
      } catch (error) {
        console.error("Error checking rehearsal count:", error);
      }
    };

    checkRehearsalCount();
  }, []);

  const handleExit = async () => {
    try {
      const rehearsalId = getCurrentRehearsal();
      const speechId = getCurrentSpeech();

      if (!rehearsalId || !speechId) {
        throw new Error("No rehearsal or speech ID found");
      }

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
