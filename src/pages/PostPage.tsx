import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userBookmarked, setUserBookmarked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        // Fetch the post
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .maybeSingle();
        if (postError || !postData) throw postError || new Error("Post not found");
        setPost(postData);
        setShareCount(postData.shares || 0);

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", postData.user_id)
          .maybeSingle();
        postData.user = {
          id: postData.user_id,
          name: profileData?.full_name || profileData?.username || 'Unknown User',
          role: profileData?.role || 'athlete',
          profilePic: profileData?.avatar_url,
        };
        setPost({ ...postData });

        // Fetch like count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);
        setLikeCount(likesCount || 0);

        // Fetch comment count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);
        setCommentCount(commentsCount || 0);

        // Fetch bookmark count
        const { count: bookmarksCount } = await supabase
          .from('bookmarks')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);
        setBookmarkCount(bookmarksCount || 0);

        // Check if current user liked/bookmarked
        if (currentUser) {
          const { data: userLike } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
          setUserLiked(!!userLike);

          const { data: userBookmark } = await supabase
            .from('bookmarks')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .maybeSingle();
          setUserBookmarked(!!userBookmark);
        } else {
          setUserLiked(false);
          setUserBookmarked(false);
        }
      } catch (err) {
        setPost(null);
        console.error("PostPage error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId, currentUser?.id]);

  // Like, Bookmark, Share handlers
  const handleLike = async () => {
    if (!currentUser || !post) return;
    if (!userLiked) {
      await supabase.from("likes").insert({ user_id: currentUser.id, post_id: post.id });
      setUserLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      await supabase.from("likes").delete().eq("user_id", currentUser.id).eq("post_id", post.id);
      setUserLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    }
  };
  const handleBookmark = async () => {
    if (!currentUser || !post) return;
    if (!userBookmarked) {
      await supabase.from("bookmarks").insert({ user_id: currentUser.id, post_id: post.id });
      setUserBookmarked(true);
      setBookmarkCount((c) => c + 1);
    } else {
      await supabase.from("bookmarks").delete().eq("user_id", currentUser.id).eq("post_id", post.id);
      setUserBookmarked(false);
      setBookmarkCount((c) => Math.max(0, c - 1));
    }
  };
  const handleShare = async () => {
    if (!post) return;
    await supabase.from("posts").update({ shares: (shareCount || 0) + 1 }).eq("id", post.id);
    setShareCount((c) => c + 1);
    // Optionally, trigger share UI (navigator.share, copy link, etc.)
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }
  if (!post) {
    return <div className="text-center py-8 text-gray-500">No post found.</div>;
  }

  return (
    <div className="bg-white dark:bg-black flex flex-col items-center justify-start relative min-h-0">
      {/* Fixed back arrow */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-20 p-1 rounded-full bg-white/80 dark:bg-black/80 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="h-6 w-6 text-black dark:text-white" />
      </button>
      <div className="w-full max-w-md mx-auto">
        {/* Profile picture and name */}
        <div className="flex items-center gap-2 pt-4 pb-2 w-full px-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.profilePic} />
            <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg text-black dark:text-white">{post.user?.name || "User"}</span>
        </div>
        {/* Image/video */}
        <div className="w-full flex items-center justify-center bg-white dark:bg-black aspect-square">
          {post.image_url ? (
            <img src={post.image_url} alt="Post" className="object-contain max-h-[60vh] max-w-full mx-auto" />
          ) : post.video_url ? (
            <video src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto" controls autoPlay />
          ) : null}
        </div>
        {/* Icons row */}
        <div className="w-full flex flex-row justify-start gap-6 px-4 py-2 bg-white dark:bg-black">
          <button className={`flex items-center ${userLiked ? 'text-red-500' : 'text-black dark:text-white'}`} onClick={handleLike}>
            <Heart className="h-6 w-6" fill={userLiked ? 'currentColor' : 'none'} />
            <span className="ml-1 text-sm">{likeCount}</span>
          </button>
          <button className="flex items-center text-black dark:text-white">
            <MessageCircle className="h-6 w-6" />
            <span className="ml-1 text-sm">{commentCount}</span>
          </button>
          <button className="flex items-center text-black dark:text-white" onClick={handleShare}>
            <Share2 className="h-6 w-6" />
            <span className="ml-1 text-sm">{shareCount}</span>
          </button>
          <button className={`flex items-center ml-auto ${userBookmarked ? 'text-blue-500' : 'text-black dark:text-white'}`} onClick={handleBookmark}>
            <Bookmark className="h-6 w-6" fill={userBookmarked ? 'currentColor' : 'none'} />
            <span className="ml-1 text-sm">{bookmarkCount}</span>
          </button>
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