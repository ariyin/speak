import { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UploadModal from "../components/UploadModal";
import RecordingModal from "../components/RecordingModal";
import ExitButton from "../components/ExitButton";
import { uploadFileToCloudinary } from "../utils/cloudinaryService";

function Video() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [backRoute, setBackRoute] = useState<string | null>(null);
  const { rehearsalId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // fetch the rehearsal data to determine the back route
    const fetchRehearsalData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/rehearsal/${rehearsalId}`,
        );
        const analysis = response.data.analysis;

        // if only delivery is selected, back goes to type page
        // otherwise (content-only or both), back goes to content page
        if (analysis.length === 1 && analysis[0] === "delivery") {
          setBackRoute(`/rehearsal/${rehearsalId}/type`);
        } else {
          setBackRoute(`/rehearsal/${rehearsalId}/content`);
        }
      } catch (error) {
        console.error("Error fetching rehearsal data:", error);
        // default to type page if there's an error
        setBackRoute(`/rehearsal/${rehearsalId}/type`);
      }
    };

    fetchRehearsalData();
  }, []);

  const handleNext = async () => {
    if (!videoFile) return;

    // Disable button and show uploading state
    const button = document.querySelector(
      ".flex.justify-between > button:last-of-type",
    ) as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.textContent = "uploading...";
    }

    const { secureUrl, duration } = await uploadFileToCloudinary(videoFile);

    // Update rehearsal with link for preview
    try {
      await axios.patch(
        `http://localhost:8000/rehearsal/video_url/${rehearsalId}`,
        { videoUrl: secureUrl, duration: duration },
      );
    } catch (error) {
      console.error("Error updating rehearsal video url:", error);
    }

    // navigate or pass along url
    navigate(`/rehearsal/${rehearsalId}/analysis`, {
      state: { secureUrl },
    });
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
      <ExitButton />
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

        <button onClick={handleNext} disabled={!videoFile}>
          next
        </button>
      </div>
    </div>
  );
}

export default Video;
