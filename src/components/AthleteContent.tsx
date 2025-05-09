import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ContentFeedCard from "./ContentFeedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AnimatedLoadingScreen from "./AnimatedLoadingScreen";

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
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        console.log("Fetching posts with params:", { filterSport, userId });
        
        let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (filterSport && filterSport !== "for-you") {
          query = query.eq('sport', filterSport);
        }
        
        if (userId) {
          console.log("Filtering by user ID:", userId);
          query = query.eq('user_id', userId);
        }
        
        const { data: postsData, error: postsError } = await query;
        
        if (postsError) {
          console.error("Error fetching posts:", postsError);
          throw postsError;
        }
        
        console.log("Posts data fetched:", postsData?.length || 0, "posts");
        
        if (postsData) {
          const postsWithStats = await Promise.all(
            postsData.map(async (post) => {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', post.user_id)
                .maybeSingle();  // Changed from single() to maybeSingle()
              
              if (profileError) {
                console.error('Error fetching profile:', profileError);
              }
              
              const { count: likesCount, error: likesError } = await supabase
                .from('likes')
                .select('id', { count: 'exact' })
                .eq('post_id', post.id);
              
              const { count: commentsCount, error: commentsError } = await supabase
                .from('comments')
                .select('id', { count: 'exact' })
                .eq('post_id', post.id);
              
              const { data: userLiked, error: userLikedError } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user?.id || '')
                .maybeSingle();
              
              const { data: userBookmarked, error: userBookmarkedError } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user?.id || '')
                .maybeSingle();
              
              return {
                ...post,
                user: {
                  id: post.user_id,
                  name: profileData?.full_name || 'Unknown User',
                  role: profileData?.role || 'athlete',
                  profilePic: profileData?.avatar_url
                },
                content: {
                  text: post.content,
                  image: post.image_url,
                  video: post.video_url
                },
                stats: {
                  likes: likesCount || 0,
                  comments: commentsCount || 0,
                  shares: 0
                },
                userLiked: !!userLiked,
                userBookmarked: !!userBookmarked
              };
            })
          );
          
          setPosts(postsWithStats);
          if (onPostCount) onPostCount(postsWithStats.length);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [filterSport, userId, user?.id]);
  
  if (loading) {
    return (
      <AnimatedLoadingScreen
        isLoading={loading}
        onComplete={() => {}}
      />
    );
  }
  
  return (
    <>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {filterSport 
            ? `No ${filterSport} content found.` 
            : 'No content found. Follow athletes or teams to see their updates here.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {posts.map((post) => (
            <ContentFeedCard
              key={post.id}
              id={post.id}
              user={post.user}
              timestamp={new Date(post.created_at)}
              content={post.content}
              stats={post.stats}
              userLiked={post.userLiked}
              userBookmarked={post.userBookmarked}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AthleteContent;
