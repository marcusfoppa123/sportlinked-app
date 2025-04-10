
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
  
  // Athletes see all content
  if (user?.role === "athlete") {
    return <AthleteContent filterSport={filterSport} />;
  }
  
  // Scouts and teams only see athlete content
  return <AthleteContent filterSport={filterSport} />;
};

export default ContentFeed;
