import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-[#0d1a22]"
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-[#102a37] rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-24 h-24 bg-white rounded-full"
              />
            </div>
          </motion.div>

          {/* Text Animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-white">SportsLinked</h1>
            <p className="text-white/80">Connecting Athletes Worldwide</p>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-1 bg-white/20 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-full bg-white w-1/4"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen; 