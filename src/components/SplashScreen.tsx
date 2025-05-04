import React, { useEffect, useState } from "react";

const splashImages = [
  require("@/assets/splashscreen/png/iPhone 14 & 15 Pro - 5.jpg"),
  require("@/assets/splashscreen/png/iPhone 14 & 15 Pro - 7.jpg"),
  require("@/assets/splashscreen/png/iPhone 14 & 15 Pro - 8.jpg"),
  require("@/assets/splashscreen/png/iPhone 14 & 15 Pro - 9.jpg"),
  require("@/assets/splashscreen/png/iPhone 14 & 15 Pro - 10.jpg"),
];

interface SplashScreenProps {
  onComplete?: () => void;
  useFigmaEmbed?: boolean;
}

const FigmaEmbed = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
    <iframe
      style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
      width="800"
      height="450"
      src="https://embed.figma.com/proto/iCBAZvojWHcDq6Y45PmNko/Untitled?node-id=1-161&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&embed-host=share"
      allowFullScreen
      title="Figma Splash Prototype"
    />
  </div>
);

const SplashScreen = ({ onComplete, useFigmaEmbed = false }: SplashScreenProps) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (useFigmaEmbed) return;
    if (index < splashImages.length - 1) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setIndex((i) => i + 1);
          setFade(true);
        }, 300); // fade out duration
      }, 1000); // show each image for 1s
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete, useFigmaEmbed]);

  if (useFigmaEmbed) return <FigmaEmbed />;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <img
        src={splashImages[index]}
        alt={`Splash step ${index + 1}`}
        className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"} max-h-full max-w-full rounded-xl shadow-lg`}
      />
    </div>
  );
};

export default SplashScreen; 