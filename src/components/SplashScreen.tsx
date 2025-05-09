import React, { useEffect } from "react";
import AnimatedLoadingScreen from "./AnimatedLoadingScreen";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    // Always show the splash for at least 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedLoadingScreen isLoading={isLoading} onComplete={onComplete} />
  );
};

export default SplashScreen; 