import { useState } from "react";
import { NavLink } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import RecordingModal from "../components/RecordingModal";

function Video() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  return (
    <div className="p-20">
      <NavLink to="/type" className="flex w-full">
        <button>back</button>
      </NavLink>
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadModal onRecorded={(url: string) => setVideoUrl(url)} />
        <button onClick={() => setShowRecorder(true)}>record video</button>
        {showRecorder && (
          <RecordingModal
            onClose={() => setShowRecorder(false)}
            onRecorded={(url: string) => setVideoUrl(url)}
          />
        )}
      </div>
      <NavLink to="/analysis">
        <button disabled={!videoUrl}>next</button>
      </NavLink>
    </div>
  );
}

export default Video;
