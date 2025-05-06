import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RoleSelection from "@/components/RoleSelection";
import Login from "@/components/Login";
import BottomNavigation from "@/components/BottomNavigation";
import logo from "@/assets/SportsLinked in app.png";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<"role" | "auth" | "complete">("role");
  const isMobile = useIsMobile();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.log("Index: User changed", user);
    console.log("Index: isAuthenticated", isAuthenticated);
    
    if (isAuthenticated) {
      setStep("complete");
    } else if (user?.role) {
      console.log("Setting step to auth because user has role:", user.role);
      setStep("auth");
    } else {
      setStep("role");
    }
  }, [user, isAuthenticated]);

  // Preload logo image
  useEffect(() => {
    const img = new Image();
    img.src = logo;
    img.onerror = () => {
      console.error("Logo image failed to preload");
      setLogoError(true);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="h-20 sm:h-24 md:h-32 w-auto mb-4 sm:mb-6 md:mb-8 animate-pulse bg-gray-200 rounded-lg"></div>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (step === "complete" && isAuthenticated) {
    // Redirect based on user role
    if (user?.role === "team") {
      return <Navigate to="/team-profile" />;
    }
    return <Navigate to="/for-you" />;
  }

  const showSplashScreen = () => {
    // Clear splash shown flag and reload the page
    localStorage.removeItem("splashShown");
    // Add URL parameter and reload
    window.location.href = window.location.pathname + "?showSplash=true";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#102a37' }}>
      {step === "role" && (
        <div className="flex flex-col items-center justify-center mt-6 sm:mt-10 md:mt-16 mb-4 sm:mb-6 md:mb-8 px-4">
          {!logoError ? (
            <img 
              src={logo} 
              alt="SportsLinked Logo" 
              className={`${isMobile ? 'h-20 w-auto' : 'h-32 w-auto'}`} 
              onError={(e) => {
                console.error("Logo failed to load", e);
                setLogoError(true);
                e.currentTarget.src = "/sportlinked-logo.png"; // Try fallback
              }}
            />
          ) : (
            <img 
              src="/sportlinked-logo.png" 
              alt="SportLinked Logo" 
              className={`${isMobile ? 'h-20 w-auto' : 'h-32 w-auto'}`} 
              onError={(e) => {
                console.error("Fallback logo failed too", e);
                e.currentTarget.src = "https://via.placeholder.com/320x160?text=SportLinked";
              }}
            />
          )}
          
          <button 
            onClick={showSplashScreen}
            className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg shadow transition text-sm"
          >
            Show Splash Screen
          </button>
        </div>
      )}
      <main className="flex-1 flex items-center justify-center w-full p-4">
        {step === "role" && <RoleSelection />}
        {step === "auth" && (
          <>
            <button
              onClick={() => setStep("role")}
              className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg shadow transition"
            >
              ← Back
            </button>
            <Login initialRole={user?.role} />
          </>
        )}
      </main>
      
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

export default Index;
