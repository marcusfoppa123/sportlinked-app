import React, { useRef, useState } from "react";

interface TikTokVideoProps {
  src: string;
  className?: string;
}

const TikTokVideo: React.FC<TikTokVideoProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

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

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      onClick={handleTogglePlay}
      style={{ cursor: "pointer", background: "#000" }}
    />
  );
};

export default TikTokVideo; 