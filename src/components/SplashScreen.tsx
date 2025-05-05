
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
  forceShow?: boolean;
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

const SplashScreen = ({ onComplete, useFigmaEmbed = false, forceShow = false }: SplashScreenProps) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isMobile = useIsMobile();

  // Preload all images before showing splash screen
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = splashImages.length;
    
    // Create an array to track which images are loaded
    const imageLoadStatus = new Array(totalImages).fill(false);
    
    const checkAllLoaded = () => {
      if (loadedCount === totalImages) {
        console.log("All splash images loaded successfully");
        setImagesLoaded(true);
      }
    };

    splashImages.forEach((src, i) => {
      const img = new Image();
      img.src = typeof src === 'string' ? src : '';
      
      img.onload = () => {
        console.log(`Image loaded: ${i + 1}/${totalImages}`);
        loadedCount++;
        imageLoadStatus[i] = true;
        checkAllLoaded();
      };
      
      img.onerror = (e) => {
        console.error(`Image ${i + 1} failed to load:`, e);
        // Mark as loaded anyway to prevent hanging
        loadedCount++;
        checkAllLoaded();
      };
    });

    // Fallback in case images don't load after 3 seconds
    const timeout = setTimeout(() => {
      if (!imagesLoaded) {
        console.log("Fallback: Setting images as loaded after timeout");
        setImagesLoaded(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (useFigmaEmbed || !imagesLoaded) return;
    
    if (index < splashImages.length - 1) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setIndex((i) => i + 1);
          setFade(true);
        }, 300); // fade out duration
      }, 2000); // show each image for 2 seconds for smoother transitions
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(() => {
        setFade(false);
        setTimeout(() => {
          setShowSplash(false);
          onComplete();
        }, 300);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete, useFigmaEmbed, imagesLoaded]);

  if (useFigmaEmbed) return <FigmaEmbed />;
  
  if (!showSplash || (!forceShow && !imagesLoaded)) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative h-full w-full flex items-center justify-center">
        {imagesLoaded ? (
          <img
            src={splashImages[index]}
            alt={`Splash screen ${index + 1}`}
            className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"} ${
              isMobile ? "h-full w-full object-cover" : "h-full w-full object-contain"
            } shadow-lg`}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-pulse text-white">Loading...</div>
          </div>
        )}
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
