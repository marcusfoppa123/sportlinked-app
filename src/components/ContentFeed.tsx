
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";

interface ContentFeedProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
  userId?: string; // Add userId prop
}

const ContentFeed = ({ filterSport, contentType = "posts", userId }: ContentFeedProps) => {
  const { user, supabaseUser } = useAuth();
  
  // If userId was explicitly passed, use it - otherwise use the logged-in user's ID
  const effectiveUserId = userId || (user?.id || supabaseUser?.id);
  
  // All users see athlete content
  return <AthleteContent filterSport={filterSport} contentType={contentType} userId={effectiveUserId} />;
};

export default ContentFeed;
