
import React from "react";
import { Button } from "@/components/ui/button";
import TeamContent from "@/components/TeamContent";
import BottomNavigation from "@/components/BottomNavigation";

const Teams = () => {
  return (
    <div className="team-theme min-h-screen pb-16">
      {/* Header */}
      <header className="bg-team text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Teams & Clubs</h1>
          <Button 
            variant="outline" 
            className="bg-white/20 text-white border-white/40 hover:bg-white/30"
          >
            Create Team
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        <TeamContent />
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Teams;
