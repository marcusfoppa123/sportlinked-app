import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  let userId = searchParams.get("userId");
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // If userId is missing, fetch the post by postId to get userId
        if (!userId && postId) {
          const { data: post, error: postError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", postId)
            .maybeSingle();
          if (postError || !post) throw postError || new Error("Post not found");
          userId = post.user_id;
        }
        if (!userId) throw new Error("No userId found");
        // Fetch all posts for the user
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (postsError) throw postsError;
        // Collect all unique user_ids (should be just one, but future-proof)
        const userIds = Array.from(new Set((postsData || []).map((p: any) => p.user_id)));
        // Fetch all needed profiles in one query
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds);
        if (profilesError) throw profilesError;
        // Fetch likes and bookmarks for the current user
        let userLikes: string[] = [];
        let userBookmarks: string[] = [];
        if (currentUser) {
          const { data: likesData } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", currentUser.id);
          userLikes = (likesData || []).map((l: any) => l.post_id);
          const { data: bookmarksData } = await supabase
            .from("bookmarks")
            .select("post_id")
            .eq("user_id", currentUser.id);
          userBookmarks = (bookmarksData || []).map((b: any) => b.post_id);
        }
        // Map user_id to profile
        const profileMap = new Map((profilesData || []).map((profile: any) => [profile.id, profile]));
        // Map posts to include user info and like/bookmark state
        const postsWithUser = (postsData || []).map((post: any) => {
          const profileData = profileMap.get(post.user_id);
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
            userLiked: userLikes.includes(post.id),
            userBookmarked: userBookmarks.includes(post.id),
          };
        });
        setPosts(postsWithUser);
        // Scroll to the selected post
        setTimeout(() => {
          const idx = postsWithUser.findIndex((p) => p.id === postId);
          if (containerRef.current && idx >= 0) {
            const child = containerRef.current.children[idx] as HTMLElement;
            if (child) child.scrollIntoView({ behavior: "auto" });
          }
        }, 100);
      } catch (err) {
        setPosts([]);
        console.error("PostPage error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    // eslint-disable-next-line
  }, [postId, currentUser?.id]);

  // Like, Bookmark, Share handlers
  const handleLike = async (post: any, idx: number) => {
    if (!currentUser) return;
    const liked = post.userLiked;
    if (!liked) {
      await supabase.from("likes").insert({ user_id: currentUser.id, post_id: post.id });
      setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, userLiked: true, stats: { ...p.stats, likes: p.stats.likes + 1 } } : p));
    } else {
      await supabase.from("likes").delete().eq("user_id", currentUser.id).eq("post_id", post.id);
      setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, userLiked: false, stats: { ...p.stats, likes: Math.max(0, p.stats.likes - 1) } } : p));
    }
  };
  const handleBookmark = async (post: any, idx: number) => {
    if (!currentUser) return;
    const bookmarked = post.userBookmarked;
    if (!bookmarked) {
      await supabase.from("bookmarks").insert({ user_id: currentUser.id, post_id: post.id });
      setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, userBookmarked: true, stats: { ...p.stats, bookmarks: p.stats.bookmarks + 1 } } : p));
    } else {
      await supabase.from("bookmarks").delete().eq("user_id", currentUser.id).eq("post_id", post.id);
      setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, userBookmarked: false, stats: { ...p.stats, bookmarks: Math.max(0, p.stats.bookmarks - 1) } } : p));
    }
  };
  const handleShare = async (post: any, idx: number) => {
    // Increment share count in DB
    await supabase.from("posts").update({ shares: (post.stats.shares || 0) + 1 }).eq("id", post.id);
    setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, stats: { ...p.stats, shares: p.stats.shares + 1 } } : p));
    // Optionally, trigger share UI (navigator.share, copy link, etc.)
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }
  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts found.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-start relative">
      {/* Fixed back arrow */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-20 p-1 rounded-full bg-white/80 dark:bg-black/80 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="h-6 w-6 text-black dark:text-white" />
      </button>
      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="flex-1 w-full max-w-md h-screen overflow-y-auto snap-y snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {posts.map((post, idx) => (
          <section
            key={post.id}
            className={`h-screen w-full flex flex-col items-center justify-start snap-start bg-white dark:bg-black ${idx !== 0 ? 'border-t border-gray-200 dark:border-gray-800' : ''}`}
          >
            {/* Profile picture and name in the empty space */}
            <div className="flex items-center gap-2 pt-4 pb-2 w-full px-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user?.profilePic} />
                <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg text-black dark:text-white">{post.user?.name || "User"}</span>
            </div>
            {/* Image/video */}
            <div className="w-full flex items-center justify-center bg-white dark:bg-black" style={{ aspectRatio: '1/1' }}>
              {post.image_url ? (
                <img src={post.image_url} alt="Post" className="object-contain max-h-[60vh] max-w-full mx-auto" />
              ) : post.video_url ? (
                <video src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto" controls autoPlay />
              ) : null}
            </div>
            {/* Icons row */}
            <div className="w-full flex flex-row justify-start gap-6 px-4 py-2 bg-white dark:bg-black">
              <button className={`flex items-center ${post.userLiked ? 'text-red-500' : 'text-black dark:text-white'}`} onClick={() => handleLike(post, idx)}>
                <Heart className="h-6 w-6" fill={post.userLiked ? 'currentColor' : 'none'} />
                <span className="ml-1 text-sm">{post.stats.likes}</span>
              </button>
              <button className="flex items-center text-black dark:text-white">
                <MessageCircle className="h-6 w-6" />
                <span className="ml-1 text-sm">{post.stats.comments}</span>
              </button>
              <button className="flex items-center text-black dark:text-white" onClick={() => handleShare(post, idx)}>
                <Share2 className="h-6 w-6" />
                <span className="ml-1 text-sm">{post.stats.shares}</span>
              </button>
              <button className={`flex items-center ml-auto ${post.userBookmarked ? 'text-blue-500' : 'text-black dark:text-white'}`} onClick={() => handleBookmark(post, idx)}>
                <Bookmark className="h-6 w-6" fill={post.userBookmarked ? 'currentColor' : 'none'} />
                <span className="ml-1 text-sm">{post.stats.bookmarks}</span>
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
          </section>
        ))}
      </div>
    </div>
  );
};

export default PostPage; 