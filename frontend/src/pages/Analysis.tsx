import { NavLink } from "react-router-dom";
import { useRef, useCallback } from "react";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../components/CloudinaryPlayerType";

function Analysis() {
  const playerRef = useRef<CloudinaryPlayer | null>(null);

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
    <>
      <h1>Analysis</h1>

      {/* Jump to Middle button is here, outside of VideoPlayer */}
      <button
        onClick={jumpToMiddle}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Jump to Middle
      </button>

      {/* Video Player */}
      <VideoPlayer onReady={handleReady} />

      {/* Navigation */}
      <div className="mt-4 flex flex-col space-y-2">
        <NavLink to="/type" className="text-blue-500 hover:underline">
          Rehearse again
        </NavLink>
        <NavLink to="/" className="text-red-500 hover:underline">
          Exit
        </NavLink>
      </div>
    </>
  );
}

export default Analysis;
