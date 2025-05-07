import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePostGridProps {
  userId: string;
}

const ProfilePostGrid: React.FC<ProfilePostGridProps> = ({ userId }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, image_url, video_url, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setPosts(data || []);
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
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map((post) => (
        <button
          key={post.id}
          className="aspect-square w-full overflow-hidden bg-gray-100 focus:outline-none"
          onClick={() => { /* TODO: open post detail modal */ }}
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
  );
};

export default ProfilePostGrid; 