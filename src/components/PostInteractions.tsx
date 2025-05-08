import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Heart, MessageCircle, Bookmark, Share2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

interface PostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialBookmarks: number;
  initialUserLiked: boolean;
  initialUserBookmarked: boolean;
  onDelete?: () => void;
  isOwner?: boolean;
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  postId,
  initialLikes,
  initialComments,
  initialBookmarks,
  initialUserLiked,
  initialUserBookmarked,
  onDelete,
  isOwner = false,
}) => {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isBookmarked, setIsBookmarked] = useState(initialUserBookmarked);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (!isLiked) {
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: currentUser.id,
            post_id: postId
          });

        if (error) {
          if (error.code === '23505') {
            console.log('Like already exists');
          } else {
            throw error;
          }
        }
      } else {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', postId);

        if (error) throw error;
      }

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      toast.error("Please sign in to bookmark posts");
      return;
    }

    try {
      if (!isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: currentUser.id,
            post_id: postId
          });

        if (error) {
          if (error.code === '23505') {
            console.log('Bookmark already exists');
          } else {
            throw error;
          }
        }
        toast.success("Post saved to your bookmarks");
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', postId);

        if (error) throw error;
        toast.success("Post removed from your bookmarks");
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = async () => {
    try {
      await supabase
        .from('posts')
        .update({ shares: (initialBookmarks || 0) + 1 })
        .eq('id', postId);

      // Copy post URL to clipboard
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    }
  };

  const handleDelete = async () => {
    if (!currentUser || !isOwner) return;

    try {
      // Delete associated likes, comments, and bookmarks first
      await supabase.from('likes').delete().eq('post_id', postId);
      await supabase.from('comments').delete().eq('post_id', postId);
      await supabase.from('bookmarks').delete().eq('post_id', postId);

      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast.success("Post deleted successfully");
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-2">
        <button
          className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          onClick={handleLike}
        >
          <Heart className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} />
          <span className="ml-1 text-sm">{likeCount}</span>
        </button>

        <button className="flex items-center text-gray-600">
          <MessageCircle className="h-6 w-6" />
          <span className="ml-1 text-sm">{initialComments}</span>
        </button>

        <button
          className="flex items-center text-gray-600"
          onClick={handleShare}
        >
          <Share2 className="h-6 w-6" />
        </button>

        <button
          className={`flex items-center ml-auto ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
          onClick={handleBookmark}
        >
          <Bookmark className="h-6 w-6" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>

        {isOwner && (
          <button
            className="flex items-center text-red-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-6 w-6" />
          </button>
        )}
      </div>

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
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostInteractions; 