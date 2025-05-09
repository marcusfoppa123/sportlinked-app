import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/@SportsLinkedinapp.png";

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
  // step: 0 = small logo, 1 = scale up, 2 = gradient + app name, 3 = loading bar

  useEffect(() => {
    if (step === 0) setTimeout(() => setStep(1), 600);
    if (step === 1) setTimeout(() => setStep(2), 600);
    if (step === 2) setTimeout(() => setStep(3), 800);
    if (step === 3 && !isLoading) {
      setTimeout(() => onComplete && onComplete(), 400);
    }
  }, [step, isLoading, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#102A37", zIndex: 9999 }}>
      {/* Gradient overlay for step 2 and 3 */}
      <AnimatePresence>
        {(step === 2 || step === 3) && (
          <motion.div
            key="gradient"
            style={gradientStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 flex flex-col items-center w-full">
        <AnimatePresence>
          {step === 0 && (
            <motion.img
              key="logo-small"
              src={logo}
              alt="SportsLinked Logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 0.7 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16"
              style={{ marginBottom: 0 }}
            />
          )}
          {step === 1 && (
            <motion.img
              key="logo-grow"
              src={logo}
              alt="SportsLinked Logo"
              initial={{ opacity: 1, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="w-32 h-32"
              style={{ marginBottom: 0 }}
            />
          )}
          {(step === 2 || step === 3) && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <img src={logo} alt="SportsLinked Logo" className="w-40 h-40 mb-4" />
              <div className="flex items-center text-3xl md:text-4xl font-bold tracking-wide">
                <span style={{ color: '#fff', letterSpacing: 2 }}>SPORTS</span>
                <span style={{ color: '#249FEE', marginLeft: 4, letterSpacing: 2 }}>LINKED</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Loading bar for step 3 */}
        {step === 3 && (
          <motion.div
            key="loading-bar"
            className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
        )}
      </div>
    </div>
  );
};

export default AnimatedLoadingScreen; 