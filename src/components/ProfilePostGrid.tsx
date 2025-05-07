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
        const { data, error } = await supabase
          .from("posts")
          .select("*, profiles:profiles(*), likes(count), comments(count), bookmarks(count)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        // Map stats for modal
        const mapped = (data || []).map((post: any) => ({
          ...post,
          user: {
            id: post.profiles?.id || post.user_id,
            name: post.profiles?.full_name || post.profiles?.username || 'Unknown User',
            role: post.profiles?.role || 'athlete',
            profilePic: post.profiles?.avatar_url,
          },
          stats: {
            likes: post.likes?.[0]?.count ?? 0,
            comments: post.comments?.[0]?.count ?? 0,
            bookmarks: post.bookmarks?.[0]?.count ?? 0,
            shares: post.shares ?? 0,
          },
        }));
        setPosts(mapped);
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