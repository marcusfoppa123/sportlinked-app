import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import CommentSection from "@/components/CommentSection";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TikTokVideo from "@/components/TikTokVideo";

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetch the current post to get userId
        const { data: currentPost, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .maybeSingle();
        if (postError || !currentPost) throw postError || new Error("Post not found");
        const userId = currentPost.user_id;
        // Fetch all posts for the user
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (postsError) throw postsError;
        // Fetch all needed profiles in one query
        const userIds = Array.from(new Set((postsData || []).map((p: any) => p.user_id)));
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, role, bio, location, sport, position, experience, team_size, founded_year, home_venue, website, followers, following, connections, posts, offers, ppg, apg, rpg, games, win_percentage, scout_type, scout_team, scout_sport, scout_years_experience, created_at, updated_at")
          .in("id", userIds);
        // Map user_id to profile
        const profileMap = new Map((profilesData || []).map((profile: any) => [profile.id, profile]));
        // For each post, fetch live stats and user state
        const postsWithStats = await Promise.all(
          (postsData || []).map(async (post: any) => {
            // Like count
            const { count: likesCount } = await supabase
              .from('likes')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);
            // Comment count
            const { count: commentsCount } = await supabase
              .from('comments')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);
            // Bookmark count
            const { count: bookmarksCount } = await supabase
              .from('bookmarks')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);
            // User liked/bookmarked
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
            // Profile
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
                likes: likesCount || 0,
                comments: commentsCount || 0,
                bookmarks: bookmarksCount || 0,
                shares: post.shares || 0,
              },
              userLiked,
              userBookmarked,
            };
          })
        );
        setPosts(postsWithStats);
        // Scroll to the selected post
        setTimeout(() => {
          const idx = postsWithStats.findIndex((p) => p.id === postId);
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
    if (postId) fetchPosts();
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
    await supabase.from("posts").update({ shares: (post.stats.shares || 0) + 1 }).eq("id", post.id);
    setPosts((prev) => prev.map((p, i) => i === idx ? { ...p, stats: { ...p.stats, shares: p.stats.shares + 1 } } : p));
  };

  // Delete post handler
  const handleDeletePost = async () => {
    if (!postToDelete || !currentUser) {
      setShowDeleteDialog(false);
      setPostToDelete(null);
      return;
    }
    
    try {
      // Find the post to delete (to get image/video URL)
      const post = posts.find((p) => p.id === postToDelete);
      
      if (!post) {
        toast.error("Post not found");
        setShowDeleteDialog(false);
        setPostToDelete(null);
        return;
      }

      // Delete associated likes, comments, and bookmarks first
      await Promise.all([
        supabase.from('likes').delete().eq('post_id', postToDelete),
        supabase.from('comments').delete().eq('post_id', postToDelete),
        supabase.from('bookmarks').delete().eq('post_id', postToDelete)
      ]);
      
      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postToDelete)
        .eq('user_id', currentUser.id);
        
      if (error) {
        console.error('Error deleting post:', error);
        toast.error(`Failed to delete post: ${error.message}`);
        setShowDeleteDialog(false);
        setPostToDelete(null);
        return;
      }

      // Delete image/video from Supabase Storage if present
      if (post && (post.image_url || post.video_url)) {
        const mediaUrl = post.image_url || post.video_url;
        if (mediaUrl) {
          // Extract the storage path from the public URL
          const match = mediaUrl.match(/storage\/v1\/object\/public\/([^?]+)/);
          if (match && match[1]) {
            const filePath = match[1];
            const [bucket, ...pathParts] = filePath.split('/');
            const path = pathParts.join('/');
            await supabase.storage.from(bucket).remove([path]);
          }
        }
      }

      // Update UI after successful deletion
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
      toast.success("Post deleted successfully");
      
      // Navigate back to profile if we deleted the current post
      if (postToDelete === postId) {
        navigate("/profile");
      }

      setShowDeleteDialog(false);
      setPostToDelete(null);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Error deleting post: ${error.message || 'Unknown error'}`);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }
  if (!posts.length) {
    return <div className="text-center py-8 text-gray-500">No posts found.</div>;
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
      <div
        ref={containerRef}
        className="w-full max-w-md mx-auto overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch", maxHeight: '100vh' }}
      >
        {posts.map((post, idx) => (
          <section
            key={post.id}
            className="w-full flex flex-col items-center justify-start bg-white dark:bg-black"
            style={{ margin: 0, padding: 0 }}
          >
            {/* Profile picture, name, and three dots menu */}
            <div className="flex items-center gap-2 pt-4 pb-2 w-full px-4 relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user?.profilePic} />
                <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg text-black dark:text-white">{post.user?.name || "User"}</span>
              {/* Three dots menu for post owner */}
              {currentUser?.id === post.user.id && (
                <button
                  className="absolute right-2 top-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => { setShowDeleteDialog(true); setPostToDelete(post.id); }}
                >
                  <MoreHorizontal className="h-6 w-6 text-black dark:text-white" />
                </button>
              )}
            </div>
            {/* Image/video */}
            <div className="w-full flex items-center justify-center bg-white dark:bg-black aspect-square">
              {post.image_url ? (
                <img src={post.image_url} alt="Post" className="object-contain max-h-[60vh] max-w-full mx-auto" />
              ) : post.video_url ? (
                <TikTokVideo src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto rounded-xl" />
              ) : null}
            </div>
            {/* Icons row */}
            <div className="w-full flex flex-row justify-start gap-6 px-4 py-2 bg-white dark:bg-black">
              <button className={`flex items-center ${post.userLiked ? 'text-red-500' : 'text-black dark:text-white'}`} onClick={() => handleLike(post, idx)}>
                <Heart className="h-6 w-6" fill={post.userLiked ? 'currentColor' : 'none'} />
                <span className="ml-1 text-sm">{post.stats.likes}</span>
              </button>
              <button className="flex items-center text-black dark:text-white" onClick={() => setActiveCommentPostId(post.id)}>
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
              {/* Hashtags */}
              {(Array.isArray(post.hashtags) && post.hashtags.length > 0 ? post.hashtags : (post.content?.match(/#(\w+)/g) || []).map(tag => tag.slice(1))).length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {(Array.isArray(post.hashtags) && post.hashtags.length > 0 ? post.hashtags : (post.content?.match(/#(\w+)/g) || []).map(tag => tag.slice(1))).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-inherit cursor-pointer hover:underline"
                      onClick={() => navigate(`/hashtag/${tag}`)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Comment Section Modal */}
            <CommentSection
              isOpen={activeCommentPostId === post.id}
              onClose={() => setActiveCommentPostId(null)}
              postId={post.id}
            />
          </section>
        ))}
      </div>
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostPage; 
