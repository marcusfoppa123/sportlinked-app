
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
  
  // Ensure userId is not an empty string
  const validUserId = userId && userId.trim() !== "" ? userId : undefined;
  
  // All users see athlete content
  return <AthleteContent filterSport={filterSport} contentType={contentType} userId={validUserId} />;
};

export default ContentFeed;
