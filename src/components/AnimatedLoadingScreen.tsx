import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import icon from "@/assets/sportslinked-icon.png";
import nameLogo from "@/assets/sportslinked-logo.png";

const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
};

interface AnimatedLoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const darkGradient = "linear-gradient(180deg, #2A88B8 0%, #479DC8 100%)";
const lightGradient = "linear-gradient(180deg, #479DC8 0%, #B3E6FF 100%)";

const AnimatedLoadingScreen: React.FC<AnimatedLoadingScreenProps> = ({ isLoading, onComplete }) => {
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (step === 0) setTimeout(() => setStep(1), 700);
    if (step === 1) setTimeout(() => setStep(2), 700);
    if (step === 2) setTimeout(() => setStep(3), 700);
    if (step === 3) setTimeout(() => setStep(4), 700);
    if (step === 4 && !isLoading) {
      setTimeout(() => onComplete && onComplete(), 400);
    }
  }, [step, isLoading, onComplete]);

  // Responsive logo size
  const iconSize = isMobile ? 'w-24' : 'w-40';
  const nameLogoSize = isMobile ? 'w-40' : 'w-80';

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#102A37", zIndex: 9999 }}>
      {/* Gradient background transition */}
      <motion.div
        style={{
          background: step < 4 ? darkGradient : lightGradient,
          opacity: 0.95,
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ duration: 1.2 }}
      />
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        <AnimatePresence mode="wait">
          {/* Step 0: Small icon in center */}
          {step === 0 && (
            <motion.img
              key="icon-center"
              src={icon}
              alt="SportsLinked Icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, duration: 0.7 }}
              className={`${iconSize} h-auto object-contain mx-auto`}
              style={{ marginBottom: 0 }}
            />
          )}
          {/* Step 1: Icon scales up */}
          {step === 1 && (
            <motion.img
              key="icon-scale"
              src={icon}
              alt="SportsLinked Icon"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 1, scale: 1.5 }}
              transition={{ type: "spring", stiffness: 100, damping: 16, duration: 0.7 }}
              className={`${iconSize} h-auto object-contain mx-auto`}
              style={{ marginBottom: 0 }}
            />
          )}
          {/* Step 2: Icon moves to right */}
          {step === 2 && (
            <motion.img
              key="icon-move-right"
              src={icon}
              alt="SportsLinked Icon"
              initial={{ x: 0, scale: 1.5, opacity: 1 }}
              animate={{ x: isMobile ? 60 : 180, scale: 1.2, opacity: 1 }}
              exit={{ x: isMobile ? 60 : 180, scale: 1.2, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 14, duration: 0.7 }}
              className={`${iconSize} h-auto object-contain mx-auto`}
              style={{ marginBottom: 0 }}
            />
          )}
          {/* Step 3: Name logo appears to left, icon stays right, background lightens */}
          {step === 3 && (
            <motion.div
              key="name-and-icon"
              className="flex items-center justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ minHeight: isMobile ? 120 : 180 }}
            >
              <motion.img
                src={nameLogo}
                alt="SportsLinked Name Logo"
                className={`${nameLogoSize} h-auto object-contain`}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                style={{ marginRight: isMobile ? 12 : 32 }}
              />
              <motion.img
                src={icon}
                alt="SportsLinked Icon"
                className={`${iconSize} h-auto object-contain`}
                initial={{ x: 0, scale: 1.2, opacity: 1 }}
                animate={{ x: isMobile ? 60 : 180, scale: 1.2, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 14, duration: 0.7 }}
              />
            </motion.div>
          )}
          {/* Step 4: Loading bar appears below name logo and icon */}
          {step === 4 && (
            <motion.div
              key="name-icon-bar"
              className="flex flex-col items-center justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center w-full" style={{ minHeight: isMobile ? 120 : 180 }}>
                <motion.img
                  src={nameLogo}
                  alt="SportsLinked Name Logo"
                  className={`${nameLogoSize} h-auto object-contain`}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  style={{ marginRight: isMobile ? 12 : 32 }}
                />
                <motion.img
                  src={icon}
                  alt="SportsLinked Icon"
                  className={`${iconSize} h-auto object-contain`}
                  initial={{ x: 0, scale: 1.2, opacity: 1 }}
                  animate={{ x: isMobile ? 60 : 180, scale: 1.2, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 14, duration: 0.7 }}
                />
              </div>
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