
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RoleSelection from "@/components/RoleSelection";
import Login from "@/components/Login";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<"role" | "auth" | "complete">("role");

  useEffect(() => {
    if (isAuthenticated) {
      setStep("complete");
    } else if (user?.role) {
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

  if (step === "complete") {
    return <Navigate to="/for-you" />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${user?.role === "athlete" ? "athlete-theme" : user?.role === "scout" ? "scout-theme" : ""}`}>
      <main className="flex-1 flex items-center justify-center">
        {step === "role" && <RoleSelection />}
        {step === "auth" && <Login initialRole={user?.role} />}
      </main>
      
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

export default Index;
