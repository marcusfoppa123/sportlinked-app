
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";

interface ContentFeedProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
}

const ContentFeed = ({ filterSport, contentType = "posts" }: ContentFeedProps) => {
  const { user } = useAuth();
  
  // All users see athlete content
  return <AthleteContent filterSport={filterSport} contentType={contentType} />;
};

export default ContentFeed;
