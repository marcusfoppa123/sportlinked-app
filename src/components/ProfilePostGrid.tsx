import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ContentFeedCard from "./ContentFeedCard";

interface ProfilePostGridProps {
  userId: string;
  onPostDeleted?: () => void;
}

const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({ userId, onPostDeleted }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (postsError) throw postsError;

      const postsWithUser = await Promise.all(
        (postsData || []).map(async (post: any) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", post.user_id)
            .maybeSingle();

          // Get likes count
          const { count: likesCount } = await supabase
            .from('likes')
            .select('id', { count: 'exact' })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('id', { count: 'exact' })
            .eq('post_id', post.id);

          // Get bookmarks count
          const { count: bookmarksCount } = await supabase
            .from('bookmarks')
            .select('id', { count: 'exact' })
            .eq('post_id', post.id);

          // Check if current user has liked/bookmarked
          let userLiked = false;
          let userBookmarked = false;
          if (currentUser) {
            const { data: userLike } = await supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', currentUser.id)
              .maybeSingle();
            userLiked = !!userLike;

            const { data: userBookmark } = await supabase
              .from('bookmarks')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', currentUser.id)
              .maybeSingle();
            userBookmarked = !!userBookmark;
          }

          return {
            ...post,
            user: {
              id: post.user_id,
              name: profileData?.full_name || profileData?.username || 'Unknown User',
              role: profileData?.role || 'athlete',
              profilePic: profileData?.avatar_url,
            },
            content: {
              text: post.content,
              image: post.image_url,
              video: post.video_url,
            },
            stats: {
              likes: likesCount || 0,
              comments: commentsCount || 0,
              shares: bookmarksCount || 0,
            },
            userLiked,
            userBookmarked,
          };
        })
      );
      setPosts(postsWithUser);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchPosts();
  }, [userId, currentUser?.id]);

  const handlePostDelete = async (postId: string) => {
    try {
      // Delete associated likes, comments, and bookmarks first
      await Promise.all([
        supabase.from('likes').delete().eq('post_id', postId),
        supabase.from('comments').delete().eq('post_id', postId),
        supabase.from('bookmarks').delete().eq('post_id', postId)
      ]);

      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', currentUser?.id);

      if (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
      }

      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
      if (onPostDeleted) onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error; // Let the PostInteractions component handle the error
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
      {posts.map((post) => (
        <div key={post.id} className="w-full">
          <ContentFeedCard
            id={post.id}
            user={post.user}
            timestamp={new Date(post.created_at)}
            content={post.content}
            stats={post.stats}
            userLiked={post.userLiked}
            userBookmarked={post.userBookmarked}
            onDelete={() => handlePostDelete(post.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProfilePostGrid; 