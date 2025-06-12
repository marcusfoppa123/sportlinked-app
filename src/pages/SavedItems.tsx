import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContentFeedCard from "@/components/ContentFeedCard";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AnimatedLoadingScreen from "@/components/AnimatedLoadingScreen";
import ProfilePostThumbnail from "@/components/ProfilePostThumbnail";

const SavedItems = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch all bookmarks for the current user
        const { data: bookmarks, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select('post_id')
          .eq('user_id', user.id);
        
        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
          throw bookmarksError;
        }
        
        if (!bookmarks || bookmarks.length === 0) {
          setSavedPosts([]);
          setLoading(false);
          return;
        }
        
        // Extract post IDs from bookmarks
        const postIds = bookmarks.map(bookmark => bookmark.post_id);
        
        // Fetch the actual posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .in('id', postIds)
          .order('created_at', { ascending: false });
        
        if (postsError) {
          console.error('Error fetching saved posts:', postsError);
          throw postsError;
        }
        
        // For each post, fetch additional data (user profile, stats, etc.)
        const postsWithStats = await Promise.all(
          (postsData || []).map(async (post) => {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', post.user_id)
              .maybeSingle();
            
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
              .eq('user_id', user.id || '')
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
              userBookmarked: true // These are saved posts, so they are bookmarked
            };
          })
        );
        
        setSavedPosts(postsWithStats);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
        toast.error('Failed to load saved posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedPosts();
  }, [user?.id]);
  
  // Function to render saved post in grid view
  const renderSavedPostCard = (post) => {
    return (
      <Card key={post.id} className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-3 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.user.profilePic} />
              <AvatarFallback className="text-xs">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate dark:text-white">{post.user.name}</span>
          </div>
          
          {post.content.image && (
            <div className="relative pt-[100%] bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mb-2">
              <img 
                src={post.content.image} 
                alt="Post" 
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          )}
          
          <p className="text-xs line-clamp-2 mb-2 dark:text-gray-300">{post.content.text}</p>
          
          <div className="mt-auto flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{post.stats.likes} likes</span>
            <span>{post.stats.comments} comments</span>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Saved Items</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        {/* Only show Posts, no tabs */}
        {loading ? (
          <AnimatedLoadingScreen isLoading={loading} onComplete={() => {}} />
        ) : savedPosts.length > 0 ? (
          <div className="grid grid-cols-2 gap-1">
            {savedPosts.map(post => (
              <ProfilePostThumbnail
                key={post.id}
                post={{
                  id: post.id,
                  image_url: post.content.image,
                  video_url: post.content.video,
                  likeCount: post.stats.likes || 0,
                }}
                canDelete={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No saved posts yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Bookmark posts to save them for later
            </p>
          </div>
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SavedItems;
