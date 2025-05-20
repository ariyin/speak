import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import RecordingModal from "../components/RecordingModal";
import { uploadFileToCloudinary } from "../utils/cloudinaryService";
import axios from "axios";
import {
  deleteSpeech,
  deleteCurrentRehearsal,
  getCurrentRehearsal,
  getCurrentSpeech,
} from "../utils/auth";

function Video() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [backRoute, setBackRoute] = useState<string | null>(null);
  const { rehearsalId } = useParams();

  useEffect(() => {
    // Fetch the rehearsal data to determine the back route
    const fetchRehearsalData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/rehearsal/${rehearsalId}`,
        );
        const analysis = response.data.analysis;

        // If only delivery is selected, back goes to type page
        // Otherwise (content-only or both), back goes to content page
        if (analysis.length === 1 && analysis[0] === "delivery") {
          setBackRoute(`/rehearsal/${rehearsalId}/type`);
        } else {
          setBackRoute(`/rehearsal/${rehearsalId}/content`);
        }
      } catch (error) {
        console.error("Error fetching rehearsal data:", error);
        // Default to type page if there's an error
        setBackRoute(`/rehearsal/${rehearsalId}/type`);
      }
    };

    fetchRehearsalData();
  }, []);

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
        {backRoute && (
          <NavLink to={backRoute}>
            <button>back</button>
          </NavLink>
        )}
        {videoFile && !showRecorder && (
          <button onClick={clearUpload}>clear upload</button>
        )}
        <NavLink to={`/rehearsal/${rehearsalId}/analysis`}>
          <button onClick={handleNext} disabled={!videoFile}>
            next
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Video;
