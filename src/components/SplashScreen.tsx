import React, { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1a22]">
      <div className="flex flex-col items-center space-y-12">
        {/* Logo */}
        <div className="relative">
          <div className="w-40 h-40 bg-[#102a37] rounded-full flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#ffffff]">Welcome to SportsLinked</h1>
          <p className="text-xl text-[rgba(255,255,255,0.8)]">Connecting Athletes Worldwide</p>
        </div>

        {/* Loading Indicator */}
        <div className="w-64 h-1.5 bg-[rgba(255,255,255,0.2)] rounded-full overflow-hidden">
          <div className="h-full bg-[#ffffff] w-1/4 animate-[loading_2s_linear_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 