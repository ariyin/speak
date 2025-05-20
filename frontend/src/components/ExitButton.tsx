import { useNavigate } from "react-router-dom";
import {
  getCurrentRehearsal,
  getCurrentSpeech,
  deleteCurrentRehearsal,
  deleteSpeech,
} from "../utils/auth";
import axios from "axios";

function ExitButton() {
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      const rehearsalId = getCurrentRehearsal();
      const speechId = getCurrentSpeech();

      if (!rehearsalId || !speechId) {
        throw new Error("No rehearsal or speech ID found");
      }

      const rehearsalDeleted = await axios.delete(
        `http://localhost:8000/rehearsal/${rehearsalId}`,
      );

      const speechDeleted = await axios.delete(
        `http://localhost:8000/speech/${speechId}`,
      );

      if (rehearsalDeleted.status === 200 && speechDeleted.status === 200) {
        deleteCurrentRehearsal();
        deleteSpeech(speechId);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting speech:", error);
    }
  };

  return (
    <button onClick={handleExit} className="justify-self-end">
      exit
    </button>
  );
}

export default ExitButton;
