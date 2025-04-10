
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";
import ScoutContent from "./ScoutContent";
import TeamContent from "./TeamContent";

interface ContentFeedProps {
  filterSport?: string;
}

const ContentFeed = ({ filterSport }: ContentFeedProps) => {
  const { user } = useAuth();
  
  if (user?.role === "athlete") {
    return <AthleteContent filterSport={filterSport} />;
  }
  
  if (user?.role === "scout") {
    return <ScoutContent filterSport={filterSport} />;
  }
  
  // For team/club view (can be enabled based on a different role or setting)
  // For now, we'll use it as default for simplicity
  return <TeamContent filterSport={filterSport} />;
};

export default ContentFeed;
