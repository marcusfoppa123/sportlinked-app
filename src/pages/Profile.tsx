import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import SideMenu from "@/components/SideMenu";
import { useMobile } from "@/hooks/use-mobile";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import FeedbackDialog from "@/components/FeedbackDialog";

const Profile = () => {
  const { user } = useAuth();
  const isMobile = useMobile();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const profileStats = {
    Connections: user.connections?.toString() || "0",
    Posts: user.posts?.toString() || "0",
    Offers: user.offers?.toString() || "0",
  };
  
  const athleteStats = user.role === "athlete" ? {
    PPG: user.ppg?.toString() || "0",
    APG: user.apg?.toString() || "0",
    RPG: user.rpg?.toString() || "0",
  } : {};

  const allStats = { ...profileStats, ...athleteStats };

  return (
    <div className={`min-h-screen flex flex-col ${user.role === "athlete" ? "athlete-theme" : "scout-theme"}`}>
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <SideMenu />}
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            
            <ProfileCard 
              user={user} 
              sport={user.sport}
              position={user.position}
              isFullProfile={true}
              stats={allStats}
            />
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Bio</h2>
                <Button variant="outline" size="sm" onClick={() => setFeedbackOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Send Feedback
                </Button>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {user.bio || "No bio provided yet. Edit your profile to add a bio."}
              </p>
            </div>
            
            {/* Additional profile sections can be added here */}
          </div>
        </main>
      </div>
      
      <BottomNavigation />
      
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
};

export default Profile;
