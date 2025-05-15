import { useState } from "react";
import { uploadFileToCloudinary } from "../lib/cloudinaryService";

interface UploadModalProps {
  onRecorded: (url: string) => void;
}

function UploadModal({ onRecorded }: UploadModalProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleUpload(file: File) {
    try {
      const url = await uploadFileToCloudinary(file);
      setVideoUrl(url);
      onRecorded(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  return (
    <div id="dropbox">
      <form className="my-form">
        <div className="form_line">
          <div className="form_controls">
            <div className="upload_button_holder">
              <input
                type="file"
                id="fileElem"
                multiple
                accept="video/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.[0]) {
                    handleUpload(files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <div id="gallery">
        {videoUrl && (
          <img src={videoUrl} alt="Uploaded" style={{ width: "100px" }} />
        )}
      </div>
    </div>
  );
}

export default UploadModal;
