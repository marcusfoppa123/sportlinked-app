import React from "react";
import { useAuth } from "@/context/AuthContext";
import AthleteContent from "./AthleteContent";

interface ContentFeedProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
  userId?: string; // Add userId prop
  showAllPosts?: boolean; // Add new prop to show all posts or just the user's
  onPostCount?: (count: number) => void;
}

const ContentFeed = ({ 
  filterSport, 
  contentType = "posts", 
  userId,
  showAllPosts = true,  // Default to showing all posts
  onPostCount
}: ContentFeedProps) => {
  const { user, supabaseUser } = useAuth();
  
  // If userId was explicitly passed, use it - otherwise use the logged-in user's ID
  const effectiveUserId = userId || (user?.id || supabaseUser?.id);
  
  // All users see athlete content
  return (
    <AthleteContent 
      filterSport={filterSport} 
      contentType={contentType} 
      userId={showAllPosts ? undefined : effectiveUserId} 
      onPostCount={onPostCount}
    />
  );
};

export default ContentFeed;
