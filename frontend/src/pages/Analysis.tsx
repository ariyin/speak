import { NavLink } from "react-router-dom";
import { useRef, useCallback } from "react";
import VideoPlayer from "../components/VideoPlayer";
import type { CloudinaryPlayer } from "../lib/cloudinaryService";

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
    <div className="layout-tb">
      <NavLink to="/" className="justify-self-end">
        <button>exit</button>
      </NavLink>
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
        <NavLink to="/type">
          <button>rehearse again</button>
        </NavLink>
        <NavLink to="/summary">
          <button>finish</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Analysis;
