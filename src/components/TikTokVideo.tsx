import React, { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TikTokVideoProps {
  src: string;
  className?: string;
}

const TikTokVideo: React.FC<TikTokVideoProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent pausing/playing when clicking the mute button
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className={className}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        controls={false}
        onClick={handleTogglePlay}
        style={{ cursor: "pointer", background: "#000", width: "100%", height: "100%" }}
      />
      {/* Mute/Unmute Button Overlay */}
      <button
        onClick={handleToggleMute}
        className="absolute bottom-2 right-2 bg-black/60 rounded-full p-2 flex items-center justify-center z-10"
        style={{ border: "none" }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};

export default TikTokVideo; 