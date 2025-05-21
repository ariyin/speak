import { useState, useEffect, useRef } from "react";

interface RecordingModalProps {
  onClose: () => void;
  onRecorded: (file: File) => void;
}

function RecordingModal({ onClose, onRecorded }: RecordingModalProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recording, setRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);
  const [isPaused, setIsPaused] = useState(false);

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

          onRecorded(file);
          onClose();
        };
        setMediaRecorder(recorder);
      });

    return () => {
      // cleanup: stop all tracks (camera/mic) when the component unmounts or closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // stops the camera/mic
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

  const togglePause = () => {
    if (!mediaRecorder) return;

    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  return (
    <>
      <video id="camera-preview" autoPlay muted className="relative" />
      {!recording ? (
        <button onClick={start} className="absolute right-2 bottom-2">
          start
        </button>
      ) : (
        <>
          <div
            onClick={togglePause}
            className="group border-cherry hover:bg-cherry absolute bottom-3 left-1/2 flex size-10 -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full border-2 bg-white transition-colors hover:border-black"
          >
            {isPaused ? (
              // resume
              <svg
                viewBox="0 0 24 24"
                className="size-5 fill-black transition-colors group-hover:fill-white"
              >
                <polygon points="8,5 19,12 8,19" />
              </svg>
            ) : (
              // pause
              <div className="flex space-x-1">
                <div className="h-3.5 w-1 bg-black transition-colors group-hover:bg-white" />
                <div className="h-3.5 w-1 bg-black transition-colors group-hover:bg-white" />
              </div>
            )}
          </div>
          <button onClick={stop} className="absolute right-2 bottom-2">
            end
          </button>
        </>
      )}
    </>
  );
}

export default RecordingModal;
