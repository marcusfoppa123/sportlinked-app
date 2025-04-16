import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ContentFeedCard from "./ContentFeedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AthleteContentProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
  userId?: string;
}

const AthleteContent = ({ 
  filterSport, 
  contentType = "posts",
  userId 
}: AthleteContentProps) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (filterSport && filterSport !== "for-you") {
          query = query.eq('sport', filterSport);
        }
        
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        const { data: postsData, error: postsError } = await query;
        
        if (postsError) {
          throw postsError;
        }
        
        if (postsData) {
          const postsWithStats = await Promise.all(
            postsData.map(async (post) => {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', post.user_id)
                .single();
              
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
  
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {filterSport 
            ? `No ${filterSport} content found.` 
            : 'No content found. Follow athletes or teams to see their updates here.'}
        </div>
      ) : (
        posts.map((post) => (
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
        ))
      )}
    </div>
  );
};

export default AthleteContent;
