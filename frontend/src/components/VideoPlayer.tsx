import { useEffect, useRef, useState } from "react";
import type { CloudinaryPlayer } from "../lib/cloudinaryService";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

interface VideoPlayerProps {
  onReady?: (player: CloudinaryPlayer) => void;
}

const VideoPlayer = ({ onReady }: VideoPlayerProps) => {
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

      player.source("youtube_NwpJKXXgqxg_1280x720_h264_pbl058");
      playerRef.current = player;
      onReady?.(player); // <-- callback used here
    });

    return () => {
      cancelAnimationFrame(handle);
      playerRef.current?.dispose?.();
    };
  }, [mounted, onReady]);

  return (
    <video
      id="my-video"
      className="cld-video-player cld-video-player-skin-dark"
      controls
      muted
    />
  );
};

export default VideoPlayer;
