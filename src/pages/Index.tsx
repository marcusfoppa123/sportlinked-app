import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RoleSelection from "@/components/RoleSelection";
import Login from "@/components/Login";
import BottomNavigation from "@/components/BottomNavigation";
import logo from "@/assets/SportsLinked in app.png";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<"role" | "auth" | "complete">("role");

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <img 
          src="/sportlinked-logo.png" 
          alt="SportLinked Logo" 
          className="h-32 w-auto mb-8 animate-pulse"
        />
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#102a37' }}>
      {step === "role" && (
        <div className="flex justify-center mt-16 mb-8">
          <img src={logo} alt="SportsLinked Logo" className="h-40 w-auto" />
        </div>
      )}
      <main className="flex-1 flex items-center justify-center w-full">
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
