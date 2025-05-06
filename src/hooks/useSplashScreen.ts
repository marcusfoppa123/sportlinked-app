import { useState, useEffect } from "react";

interface UseSplashScreenReturn {
  showSplash: boolean;
  handleSplashComplete: () => void;
}

export const useSplashScreen = (): UseSplashScreenReturn => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check if splash has been shown before
    const splashShown = localStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem("splashShown", "true");
  };
  
  return {
    showSplash,
    handleSplashComplete
  };
}; 