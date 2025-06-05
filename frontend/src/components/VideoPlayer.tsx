import { useState, useEffect, useRef } from "react";
import type { CloudinaryPlayer } from "../utils/cloudinaryService";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

interface VideoPlayerProps {
  url: string;
  onReady?: (player: CloudinaryPlayer) => void;
}

const VideoPlayer = ({ url, onReady }: VideoPlayerProps) => {
  const playerRef = useRef<CloudinaryPlayer | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handle = requestAnimationFrame(() => {
      const el = document.getElementById("my-video");
      if (!el || el.tagName.toLowerCase() !== "video") return;

      const player = cloudinary.videoPlayer("my-video", {
        cloud_name: import.meta.env.VITE_CLOUD_NAME,
        controls: true,
        secure: true,
      });

      player.source(url, {
        transformation: {
          height: 360,
          width: 640,
          crop: "fill",
          quality: "auto",
        },
      });
      playerRef.current = player;
      onReady?.(player); // <-- callback used here
    });

    return () => {
      cancelAnimationFrame(handle);
      playerRef.current?.dispose?.();
    };
  }, [mounted, onReady, url]);

  return (
    <video
      id="my-video"
      className="cld-video-player cld-video-player-skin-dark"
      controls
      muted
      style={{ width: "100%", aspectRatio: 16 / 9, height: "100%" }}
    />
  );
};

export default VideoPlayer;
