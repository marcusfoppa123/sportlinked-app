import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ContentFeedCard from "./ContentFeedCard";
import PostModal from "./PostModal";

interface ProfilePostGridProps {
  userId: string;
}

const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({ userId }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPost, setModalPost] = useState<any | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (postsError) throw postsError;
        // For each post, fetch the profile
        const postsWithUser = await Promise.all(
          (postsData || []).map(async (post: any) => {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", post.user_id)
              .maybeSingle();
            return {
              ...post,
              user: {
                id: post.user_id,
                name: profileData?.full_name || profileData?.username || 'Unknown User',
                role: profileData?.role || 'athlete',
                profilePic: profileData?.avatar_url,
              },
              stats: {
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                bookmarks: post.bookmarks_count || 0,
                shares: post.shares || 0,
              },
            };
          })
        );
        setPosts(postsWithUser);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPosts();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts yet.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {posts.map((post) => (
          <div key={post.id} onClick={() => setModalPost(post)} className="cursor-pointer">
            <ContentFeedCard
              id={post.id}
              user={post.user}
              timestamp={new Date(post.created_at)}
              content={{ text: post.content, image: post.image_url, video: post.video_url }}
              stats={post.stats}
              userLiked={post.userLiked}
              userBookmarked={post.userBookmarked}
            />
          </div>
        ))}
      </div>
      <PostModal open={!!modalPost} onClose={() => setModalPost(null)} post={modalPost} />
    </>
  );
};

export default ProfilePostGrid; 