import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfilePostThumbnail from "./ProfilePostThumbnail";
import AnimatedLoadingScreen from "./AnimatedLoadingScreen";

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
        .select("*, likes:likes(count)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (postsError) throw postsError;

      const postsWithLikes = (postsData || []).map((post: any) => ({
        ...post,
        likeCount: post.likes?.[0]?.count || 0,
      }));
      setPosts(postsWithLikes);
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
      await Promise.all([
        supabase.from('likes').delete().eq('post_id', postId),
        supabase.from('comments').delete().eq('post_id', postId),
        supabase.from('bookmarks').delete().eq('post_id', postId)
      ]);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', currentUser?.id);
      if (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
      }
      await fetchPosts();
      if (onPostDeleted) onPostDeleted();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <AnimatedLoadingScreen
        isLoading={loading}
        onComplete={() => {}}
      />
    );
  }

  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts yet.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full max-w-md mx-auto">
      {posts.map((post) => (
        <ProfilePostThumbnail
          key={post.id}
          postId={post.id}
          image={post.image_url}
          video={post.video_url}
          likeCount={post.likeCount}
        />
      ))}
    </div>
  );
};

export default ProfilePostGrid; 