
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Import images properly using relative paths
import splashImage1 from "../assets/Splashscreen/png/iPhone 14 & 15 Pro - 5.jpg";
import splashImage2 from "../assets/Splashscreen/png/iPhone 14 & 15 Pro - 7.jpg";
import splashImage3 from "../assets/Splashscreen/png/iPhone 14 & 15 Pro - 8.jpg";
import splashImage4 from "../assets/Splashscreen/png/iPhone 14 & 15 Pro - 9.jpg";
import splashImage5 from "../assets/Splashscreen/png/iPhone 14 & 15 Pro - 10.jpg";

const splashImages = [
  splashImage1,
  splashImage2,
  splashImage3,
  splashImage4,
  splashImage5,
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
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  // Preload all images to ensure smooth transitions
  useEffect(() => {
    splashImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => console.log(`Image loaded: ${src}`); // Log successful loading
      img.onerror = (e) => console.error(`Image failed to load: ${src}`, e); // Log any errors
    });
  }, []);

  useEffect(() => {
    if (useFigmaEmbed) return;
    
    if (index < splashImages.length - 1) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setIndex((i) => i + 1);
          setFade(true);
        }, 300); // fade out duration
      }, 2500); // show each image for 2.5s for better viewing
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setShowSplash(false);
          onComplete();
        }, 300);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete, useFigmaEmbed]);

  if (useFigmaEmbed) return <FigmaEmbed />;
  
  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative h-full w-full flex items-center justify-center">
        <img
          src={splashImages[index]}
          alt={`Splash screen ${index + 1}`}
          className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"} ${
            isMobile ? "h-full w-auto object-contain" : "max-h-[90vh] max-w-[90vw]"
          } shadow-lg`}
        />
      </div>
      
      {index === 0 && (
        <div className="absolute bottom-16 left-0 right-0 text-center">
          <h1 className="text-white font-bold text-xl sm:text-2xl md:text-3xl">
            Welcome to SportLinked
          </h1>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
