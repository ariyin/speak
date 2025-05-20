import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useCallback } from "react";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import {
  addRehearsal,
  getCurrentRehearsal,
  getCurrentSpeech,
  deleteCurrentRehearsal,
  deleteSpeech,
} from "../utils/auth";
import axios from "axios";

function Analysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const navigate = useNavigate();

  const handleRehearseAgain = async () => {
    try {
      // Create a new rehearsal for the same speech
      const speechId = getCurrentSpeech();
      const response = await axios.post("http://localhost:8000/rehearsal/", {
        speech: speechId,
      });

      // Update current rehearsal in localStorage
      addRehearsal(response.data.rehearsal.id);

      // Navigate to the type page for the new rehearsal
      navigate(`/rehearsal/${response.data.rehearsal.id}/type`);
    } catch (error) {
      console.error("Error creating new rehearsal:", error);
    }
  };

  const handleReady = useCallback((player: CloudinaryPlayer) => {
    playerRef.current = player;
  }, []);

  const jumpToMiddle = () => {
    const player = playerRef.current;
    if (player) {
      const middle = player.duration() / 4;
      player.currentTime(middle);
    }
  };

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
    <div className="layout-tb">
      <button onClick={handleExit} className="justify-self-end">
        exit
      </button>
      <div className="grid h-full grid-cols-2 gap-4">
        <div>
          {/* Jump to Middle button is here, outside of VideoPlayer */}
          <button onClick={jumpToMiddle}>Jump to Middle</button>

          {/* Video Player */}
          <VideoPlayer onReady={handleReady} />
        </div>
        <div className="rounded-2xl border-2 border-black p-4">
          analysis goes here
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button onClick={handleRehearseAgain}>rehearse again</button>
        {/* TODO: do we want a summary of their current run or everything */}
        <NavLink to={`/speech/${getCurrentSpeech()}/summary`}>
          <button>finish</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Analysis;
