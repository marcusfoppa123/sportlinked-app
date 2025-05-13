
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsByHashtag } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import PostModal from "@/components/PostModal";

const HashtagPage = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!hashtag) return;
      setLoading(true);
      try {
        console.log(`Fetching posts for hashtag: #${hashtag}`);
        const fetchedPosts = await getPostsByHashtag(hashtag);
        console.log(`Found ${fetchedPosts.length} posts with hashtag #${hashtag}`);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching hashtag posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [hashtag]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border">
        <div className="container px-4 h-16 flex items-center">
          <h1 className="text-xl font-bold dark:text-white">#{hashtag}</h1>
        </div>
      </header>

      {/* Posts Grid */}
      <div className="container px-4 py-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts found with #{hashtag}</div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="aspect-square cursor-pointer overflow-hidden"
                onClick={() => handlePostClick(post)}
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                ) : post.video_url ? (
                  <video
                    src={post.video_url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{post.content}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-sm flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.stats.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.stats.comments}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Post modal */}
      {selectedPost && (
        <PostModal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default HashtagPage;
