
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";

interface ContentFeedProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
  userId?: string; // Add userId prop
}

const ContentFeed = ({ filterSport, contentType = "posts", userId }: ContentFeedProps) => {
  const { user } = useAuth();
  
  // All users see athlete content
  return <AthleteContent filterSport={filterSport} contentType={contentType} userId={userId} />;
};

export default ContentFeed;
