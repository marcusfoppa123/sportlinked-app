
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";
import ScoutContent from "./ScoutContent";

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
  
  return null;
};

export default ContentFeed;
