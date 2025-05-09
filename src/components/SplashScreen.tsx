import React, { useEffect } from "react";
import AnimatedLoadingScreen from "./AnimatedLoadingScreen";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedLoadingScreen isLoading={isLoading} onComplete={onComplete} />
  );
};

export default SplashScreen; 