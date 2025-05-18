import { useState, useEffect, useRef } from "react";
import { uploadFileToCloudinary } from "../lib/cloudinaryService";

interface RecordingModalProps {
  onClose: () => void;
  onRecorded: (url: string) => void;
}

function RecordingModal({ onClose, onRecorded }: RecordingModalProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recording, setRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: 16 / 9,
        },
        audio: true,
      })
      .then((mediaStream) => {
        stream = mediaStream;
        const preview = document.getElementById(
          "camera-preview",
        ) as HTMLVideoElement;
        if (preview) {
          preview.srcObject = stream;
        }

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => chunks.current.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          const file = new File([blob], "recording.webm", {
            type: "video/webm",
          });

          const url = await uploadFileToCloudinary(file);
          onRecorded(url);
        };
        setMediaRecorder(recorder);
      });

    return () => {
      // cleanup: stop all tracks (camera/mic) when the component unmounts or closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stops the camera/mic
      }
    };
  }, []);

  const start = () => {
    chunks.current = [];
    mediaRecorder?.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <>
      <video id="camera-preview" autoPlay muted className="relative" />
      <button onClick={onClose} className="absolute top-2 right-2">
        close
      </button>
      <div className="">
        {!recording ? (
          <button onClick={start}>start</button>
        ) : (
          <>
            {/* TODO: change this into an icon */}
            <button
              onClick={() => mediaRecorder?.pause()}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 transform"
            >
              pause
            </button>
            <button onClick={stop} className="absolute right-3 bottom-3">
              end
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default RecordingModal;
