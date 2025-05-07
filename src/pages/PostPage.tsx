import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
        const idx = postsWithUser.findIndex((p) => p.id === postId);
        setCurrentIdx(idx >= 0 ? idx : 0);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPosts();
  }, [userId, postId]);

  const handlePrev = () => {
    setCurrentIdx((idx) => (idx > 0 ? idx - 1 : idx));
  };
  const handleNext = () => {
    setCurrentIdx((idx) => (idx < posts.length - 1 ? idx + 1 : idx));
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }
  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts found.</div>;
  }
  const post = posts[currentIdx];

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-start">
      {/* Top bar */}
      <div className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-800 w-full max-w-md bg-white dark:bg-black sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="h-6 w-6 text-black dark:text-white" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.user?.profilePic} />
          <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <span className="ml-2 font-semibold text-black dark:text-white">{post.user?.name || "User"}</span>
      </div>
      {/* Scrollable post area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="relative w-full flex flex-col items-center">
          {/* Up/Down navigation */}
          {currentIdx > 0 && (
            <button onClick={handlePrev} className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 text-gray-400 hover:text-black dark:hover:text-white">
              ▲
            </button>
          )}
          <div className="w-full flex items-center justify-center bg-white dark:bg-black" style={{ aspectRatio: '1/1' }}>
            {post.image_url ? (
              <img src={post.image_url} alt="Post" className="object-contain max-h-[60vh] max-w-full mx-auto" />
            ) : post.video_url ? (
              <video src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto" controls autoPlay />
            ) : null}
          </div>
          {currentIdx < posts.length - 1 && (
            <button onClick={handleNext} className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 text-gray-400 hover:text-black dark:hover:text-white">
              ▼
            </button>
          )}
        </div>
        {/* Icons row */}
        <div className="w-full flex flex-row justify-start gap-6 px-4 py-2 bg-white dark:bg-black">
          <button className="flex items-center text-black dark:text-white"><Heart className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white"><MessageCircle className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white"><Share2 className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white ml-auto"><Bookmark className="h-6 w-6" /></button>
        </div>
        {/* Liked by line */}
        <div className="px-4 text-sm text-gray-700 dark:text-gray-300 pb-1 w-full">
          Liked by <span className="font-semibold">dark_emeralds</span> and others
        </div>
        {/* Post text (bio), hashtags, comments placeholder */}
        <div className="w-full px-4 pb-4 text-black dark:text-white text-left">
          <span className="font-semibold mr-2">{post.user?.name || "User"}</span>
          <span className="whitespace-pre-line break-words">{post.content || post.bio || ""}</span>
          {/* Hashtags placeholder */}
          {post.hashtags && (
            <div className="mb-2 text-blue-400">{post.hashtags}</div>
          )}
          {/* Comments placeholder */}
          <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Comments coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default PostPage; 