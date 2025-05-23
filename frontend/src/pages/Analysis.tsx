import { useRef, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import ExitButton from "../components/ExitButton";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import { addRehearsal, getCurrentSpeech } from "../utils/auth";

function Analysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const publicId = state?.publicId;

  const handleRehearseAgain = async () => {
    try {
      // create a new rehearsal for the same speech
      const speechId = getCurrentSpeech();
      const response = await axios.post("http://localhost:8000/rehearsal/", {
        speech: speechId,
      });
      console.log(response.data);
      // update current rehearsal in localStorage
      addRehearsal(response.data.rehearsal.id);

      // navigate to the type page for the new rehearsal
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

  return (
    <div className="layout-tb">
      <ExitButton />
      <div className="grid h-full grid-cols-2 gap-4">
        <div>
          <button onClick={jumpToMiddle}>Jump to Middle</button>
          <VideoPlayer publicId={publicId} onReady={handleReady} />
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
