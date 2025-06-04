import { useState, useEffect, useRef } from "react";
import fixWebmDuration from "fix-webm-duration";

interface RecordingModalProps {
  onClose: () => void;
  onRecorded: (file: File, duration: number) => void;
}

function RecordingModal({ onClose, onRecorded }: RecordingModalProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recording, setRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          aspectRatio: 16 / 9,
          frameRate: { ideal: 30, max: 30 },
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
          preview.playsInline = true;
          preview.setAttribute("playsinline", "true");
        }

        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9,opus",
          videoBitsPerSecond: 2500000,
        });

        recorder.ondataavailable = (e) => chunks.current.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });

          const finalDuration = Math.floor(Date.now() - startTimeRef.current);

          try {
            // add duration metadata to blob
            const fixedBlob = await fixWebmDuration(blob, finalDuration, {
              logger: false,
            });

            const file = new File([fixedBlob], "recording.webm", {
              type: "video/webm",
            });

            onRecorded(file, finalDuration);
          } catch {
            // fallback to original blob if fixing fails
            const file = new File([blob], "recording.webm", {
              type: "video/webm",
            });
            onRecorded(file, finalDuration);
          }
          onClose();
        };
        setMediaRecorder(recorder);
      });

    return () => {
      // cleanup: stop all tracks (camera/mic) when the component unmounts or closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // stops the camera/mic
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const start = () => {
    chunks.current = [];
    mediaRecorder?.start();
    setRecording(true);
    // start timer
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const stop = () => {
    // get final duration before stopping
    const finalDuration = Math.floor(
      (Date.now() - startTimeRef.current) / 1000,
    );
    setDuration(finalDuration);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorder?.stop();
    setRecording(false);
  };

  const togglePause = () => {
    if (!mediaRecorder) return;

    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - duration * 1000;
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      mediaRecorder.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  return (
    <>
      <video id="camera-preview" autoPlay muted className="relative" />
      {recording && (
        <div className="font-gs absolute top-2 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-1 text-white">
          {Math.floor(duration / 60)}:
          {(duration % 60).toString().padStart(2, "0")}
        </div>
      )}
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
