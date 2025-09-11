
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
import FolderSelectionDialog from "./FolderSelectionDialog";

interface PostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialBookmarks: number;
  initialUserLiked: boolean;
  initialUserBookmarked: boolean;
  onDelete?: () => void;
  isOwner?: boolean;
  onCommentClick?: () => void;
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
  onCommentClick,
}) => {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isBookmarked, setIsBookmarked] = useState(initialUserBookmarked);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);

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
        // For scouts, show folder selection dialog
        if (currentUser.role === 'scout') {
          setShowFolderDialog(true);
          return;
        }
        
        // For non-scouts, save directly to general folder or no folder
        await saveToFolder(null);
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', postId);

        if (error) throw error;
        toast.success("Post removed from your bookmarks");
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const saveToFolder = async (folderId: string | null) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: currentUser.id,
          post_id: postId,
          folder_id: folderId
        });

      if (error) {
        if (error.code === '23505') {
          console.log('Bookmark already exists');
        } else {
          throw error;
        }
      }
      
      toast.success("Post saved to your bookmarks");
      setIsBookmarked(true);
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error('Failed to save bookmark');
    }
  };

  const handleShare = async () => {
    try {
      // First, get the current share count
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('shares')
        .eq('id', postId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate the new share count
      const currentShares = data?.shares || 0;
      const newShareCount = currentShares + 1;
      
      // Update with the new count
      const { error } = await supabase
        .from('posts')
        .update({ shares: newShareCount })
        .eq('id', postId);
        
      if (error) throw error;

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
    if (!currentUser || !isOwner) {
      toast.error("You don't have permission to delete this post");
      return;
    }

    try {
      if (onDelete) {
        await onDelete();
        setShowDeleteDialog(false);
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
      setShowDeleteDialog(false);
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

        <button 
          className="flex items-center text-gray-600"
          onClick={onCommentClick}
        >
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

      <FolderSelectionDialog
        open={showFolderDialog}
        onOpenChange={setShowFolderDialog}
        onFolderSelect={saveToFolder}
        postId={postId}
      />
    </>
  );
};

export default PostInteractions;
