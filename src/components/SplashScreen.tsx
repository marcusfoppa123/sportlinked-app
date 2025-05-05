import React, { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Reduced to 2 seconds for better UX

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1a22]">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <div className="w-32 h-32 bg-[#102a37] rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">SportsLinked</h1>
          <p className="text-white/80">Connecting Athletes Worldwide</p>
        </div>

        {/* Loading Indicator */}
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-1/4 animate-[loading_2s_linear_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 