import { useState } from "react";
import { NavLink } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import RecordingModal from "../components/RecordingModal";

function Video() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  return (
    <div className="layout-tb">
      <NavLink to="/" className="justify-self-end">
        <button>exit</button>
      </NavLink>
      <div className="grid h-full grid-rows-[auto_1fr] justify-center gap-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1>how do you want to upload your video?</h1>
          <div className="flex gap-5">
            {/* choose file */}
            <UploadModal onRecorded={(url: string) => setVideoUrl(url)} />
            <button onClick={() => setShowRecorder(true)}>record</button>
          </div>
        </div>
        <div className="video-wrapper">
          {showRecorder && (
            <RecordingModal
              onClose={() => setShowRecorder(false)}
              onRecorded={(url: string) => setVideoUrl(url)}
            />
          )}
          {/* uploaded video preview */}
          {videoUrl && <video src={videoUrl} controls />}
        </div>
      </div>
      <div className="flex justify-between">
        {/* TODO: make dynamic based on path */}
        <NavLink to="/content">
          <button>back</button>
        </NavLink>
        <NavLink to="/analysis">
          <button disabled={!videoUrl}>next</button>
        </NavLink>
      </div>
    </div>
  );
}

export default Video;
