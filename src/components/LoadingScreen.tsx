import React from "react";
import { motion } from "framer-motion";
import logo from "@/assets/SportsLinked in app.png";

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
  showLogo?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen = true,
  message = "Loading...",
  showLogo = true,
}) => {
  const content = (
    <motion.div 
      className="flex flex-col items-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showLogo && (
        <motion.div 
          className="relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img 
              src={logo} 
              alt="SportsLinked Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </motion.div>
      )}

      {/* Loading Message */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-xl text-white/80">{message}</p>
      </motion.div>

      {/* Loading Indicator */}
      <motion.div 
        className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div 
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#102a37] z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default LoadingScreen; 