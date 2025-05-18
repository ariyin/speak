import { useState } from "react";
import { NavLink } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import RecordingModal from "../components/RecordingModal";
import { uploadFileToCloudinary } from "../lib/cloudinaryService";

function Video() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  const handleNext = async () => {
    if (!videoFile) return;
    const uploadedUrl = await uploadFileToCloudinary(videoFile);
    // navigate or pass along uploadedUrl
  };

  function clearUpload() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // release memory
    }
    setVideoFile(null);
    setPreviewUrl(null);
  }

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
            <UploadModal
              onSelected={(file: File) => {
                setVideoFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
            <button
              onClick={() => setShowRecorder((prev) => !prev)}
              className={showRecorder ? "selected-button" : ""}
            >
              record
            </button>
          </div>
        </div>
        <div className="video-wrapper">
          {showRecorder && (
            <RecordingModal
              onClose={() => setShowRecorder(false)}
              onRecorded={(file: File) => {
                setVideoFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
            />
          )}
          {/* uploaded video preview */}
          {previewUrl && !showRecorder && <video src={previewUrl} controls />}
        </div>
      </div>
      <div className="flex justify-between">
        {/* TODO: make dynamic based on path */}
        <NavLink to="/content">
          <button>back</button>
        </NavLink>
        {videoFile && !showRecorder && (
          <button onClick={clearUpload}>clear upload</button>
        )}
        <NavLink to="/analysis">
          <button onClick={handleNext} disabled={!videoFile}>
            next
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Video;
