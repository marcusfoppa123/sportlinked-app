
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TeamContent from "@/components/TeamContent";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";

const Teams = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const isTeam = user?.role === "team";
  
  // Redirect to team profile if already logged in as team
  useEffect(() => {
    if (isAuthenticated && isTeam) {
      navigate("/team-profile");
    }
  }, [isAuthenticated, isTeam, navigate]);

  const handleCreateTeam = () => {
    if (isAuthenticated) {
      if (isTeam) {
        navigate("/team-profile");
      } else {
        // If logged in as non-team user, show warning
        toast.error("You're currently logged in as a " + user?.role + ". Please use a different account to create a team.");
      }
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="team-theme min-h-screen pb-16">
      {/* Header */}
      <header className="bg-team text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Teams & Clubs</h1>
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
              onClick={handleCreateTeam}
            >
              {isTeam ? "View Team" : "Create Team"}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
              onClick={() => setShowLogin(true)}
            >
              Log In
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        {showLogin && !isAuthenticated ? (
          <div className="bg-[#FEF7CD] rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-team">Team & Club Login</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLogin(false)}
                className="text-team hover:bg-team/10"
              >
                Browse as Guest
              </Button>
            </div>
            <Login initialRole="team" />
          </div>
        ) : (
          <TeamContent />
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Teams;
