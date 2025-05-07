import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
            const { data: profileData } = await supabase
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
      <div className="grid grid-cols-2 gap-1 md:gap-2">
        {posts.map((post) => (
          <button
            key={post.id}
            className="aspect-square w-full overflow-hidden bg-gray-100 focus:outline-none"
            onClick={() => setModalPost(post)}
          >
            {post.image_url ? (
              <img
                src={post.image_url}
                alt="Post"
                className="object-cover w-full h-full"
              />
            ) : post.video_url ? (
              <video
                src={post.video_url}
                className="object-cover w-full h-full"
                controls={false}
                muted
              />
            ) : null}
          </button>
        ))}
      </div>
      <PostModal open={!!modalPost} onClose={() => setModalPost(null)} post={modalPost} />
    </>
  );
};

export default ProfilePostGrid; 