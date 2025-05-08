import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import ContentFeedCard from "./ContentFeedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AthleteContentProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
  userId?: string;
  onPostCount?: (count: number) => void;
}

const AthleteContent = ({ 
  filterSport, 
  contentType = "posts",
  userId,
  onPostCount
}: AthleteContentProps) => {
  const { user } = useAuth();
  const { posts, loading, fetchPosts, fetchSavedPosts } = usePosts();
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const targetUserId = userId || user?.id;
        
        if (!targetUserId) {
          console.error('No user ID provided');
          return;
        }

        if (contentType === "profiles") {
          await fetchSavedPosts(targetUserId);
        } else {
          await fetchPosts(targetUserId, filterSport);
        }

        if (onPostCount) {
          onPostCount(posts.length);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error('Failed to load posts');
      }
    };
    
    loadPosts();
  }, [filterSport, userId, user?.id, contentType, fetchPosts, fetchSavedPosts, onPostCount, posts.length]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        {contentType === "profiles" ? "No saved posts" : "No posts yet"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ContentFeedCard
          key={post.id}
          id={post.id}
          content={{
            text: post.content,
            image: post.image_url,
            video: post.video_url
          }}
          user={post.user}
          timestamp={new Date(post.created_at)}
          stats={post.stats}
          userLiked={post.userLiked}
          userBookmarked={post.userBookmarked}
          sport={post.sport}
          hashtags={post.hashtags}
        />
      ))}
    </div>
  );
};

export default AthleteContent;
