import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/sportslinked-logo.png";

const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
};

interface AnimatedLoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const gradientStyle = {
  background: "linear-gradient(180deg, #2A88B8 0%, #479DC8 100%)",
  opacity: 0.85,
  position: "absolute" as const,
  inset: 0,
  zIndex: 1,
};

const AnimatedLoadingScreen: React.FC<AnimatedLoadingScreenProps> = ({ isLoading, onComplete }) => {
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (step === 0) setTimeout(() => setStep(1), 800);
    if (step === 1) setTimeout(() => setStep(2), 900);
    if (step === 2 && !isLoading) {
      setTimeout(() => onComplete && onComplete(), 400);
    }
  }, [step, isLoading, onComplete]);

  // Responsive logo size
  const logoSize = isMobile ? 'w-32' : 'w-56';

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#102A37", zIndex: 9999 }}>
      {/* Gradient overlay for all steps */}
      <motion.div
        style={gradientStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1.2 }}
      />
      <div className="relative z-10 flex flex-col items-center w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.img
              key="logo-fadein"
              src={logo}
              alt="SportsLinked Logo"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 18, duration: 0.9 }}
              className={`${logoSize} h-auto object-contain`}
              style={{ marginBottom: 0 }}
            />
          )}
          {step === 1 && (
            <motion.div
              key="logo-moveup"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 1, y: -30 }}
              transition={{ type: "spring", stiffness: 80, damping: 16, duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <img
                src={logo}
                alt="SportsLinked Logo"
                className={`${logoSize} h-auto object-contain`}
                style={{ marginBottom: 0 }}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="logo-appname-bar"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <img
                src={logo}
                alt="SportsLinked Logo"
                className={`${logoSize} h-auto object-contain`}
                style={{ marginBottom: 0 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="mt-4"
              >
                <div className="flex items-center text-3xl md:text-4xl font-bold tracking-wide">
                  <span style={{ color: '#fff', letterSpacing: 2 }}>SPORTS</span>
                  <span style={{ color: '#249FEE', marginLeft: 4, letterSpacing: 2 }}>LINKED</span>
                </div>
              </motion.div>
              <motion.div
                key="loading-bar"
                className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-[#249FEE]"
                  initial={{ width: '0%' }}
                  animate={{ width: isLoading ? '100%' : '100%' }}
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: isLoading ? Infinity : 0,
                    repeatType: 'reverse',
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedLoadingScreen; 