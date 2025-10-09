
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { commentSchema } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define types for comments
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userProfilePic?: string;
  text: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userProfilePic?: string;
  text: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
}

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const CommentSection = ({ isOpen, onClose, postId }: CommentSectionProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Fetch comments when dialog opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      // Direct query to comments table
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      if (commentsData) {
        // Format comments with profile information
        const formattedComments = await Promise.all(
          commentsData.map(async (comment) => {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url, role')
              .eq('id', comment.user_id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            // For a real app, we would fetch likes for each comment
            // For now, we'll just use placeholder values
            const userLiked = false;
            
            return {
              id: comment.id,
              userId: comment.user_id,
              userName: profileData?.full_name || 'Unknown User',
              userRole: profileData?.role || 'athlete',
              userProfilePic: profileData?.avatar_url,
              text: comment.content,
              timestamp: new Date(comment.created_at),
              likes: 0, // Would fetch from a likes table in a full implementation
              userLiked: userLiked,
              replies: [] // Would fetch replies in a full implementation
            };
          })
        );
        
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim() || !user) {
      if (!user) toast.error("Please sign in to comment");
      return;
    }

    // Validate comment input
    const validationResult = commentSchema.safeParse({ content: comment });
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          post_id: postId,
          content: comment.trim()
        });
      
      if (error) throw error;
      
      // Add the new comment to the UI
      const newComment: Comment = {
        id: `temp-${Date.now()}`, // Will be replaced on refetch
        userId: user.id,
        userName: user.name || 'You',
        userRole: user.role || 'athlete',
        userProfilePic: user.profilePic,
        text: comment,
        timestamp: new Date(),
        likes: 0,
        userLiked: false,
        replies: []
      };
      
      setComments([newComment, ...comments]);
      setComment("");
      toast.success("Comment posted successfully");
      
      // Refresh comments to get the proper ID
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim() || !user) {
      if (!user) toast.error("Please sign in to reply");
      return;
    }
    
    // In a real app, you would save the reply to the database here
    // For now, we'll just update the UI
    
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      userId: user.id || 'current-user',
      userName: user.name || 'You',
      userRole: user.role || 'athlete',
      userProfilePic: user.profilePic,
      text: replyText,
      timestamp: new Date(),
      likes: 0,
      userLiked: false
    };
    
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, newReply]
        };
      }
      return c;
    });
    
    setComments(updatedComments);
    setReplyText("");
    setReplyingTo(null);
    toast.success("Reply posted successfully");
  };

  const toggleLike = (commentId: string, isReply = false, replyId?: string) => {
    if (!user) {
      toast.error("Please sign in to like comments");
      return;
    }
    
    // In a real app, you would update the database here
    // For now, we'll just update the UI
    
    if (isReply && replyId) {
      // Toggle like on a reply
      const updatedComments = comments.map(c => {
        if (c.replies.some(r => r.id === replyId)) {
          return {
            ...c,
            replies: c.replies.map(r => 
              r.id === replyId 
                ? { ...r, likes: r.userLiked ? r.likes - 1 : r.likes + 1, userLiked: !r.userLiked } 
                : r
            )
          };
        }
        return c;
      });
      setComments(updatedComments);
    } else {
      // Toggle like on a comment
      const updatedComments = comments.map(c => 
        c.id === commentId 
          ? { ...c, likes: c.userLiked ? c.likes - 1 : c.likes + 1, userLiked: !c.userLiked } 
          : c
      );
      setComments(updatedComments);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{t("content.comment")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto py-4 space-y-4 px-1">
          {loading ? (
            <div className="text-center dark:text-gray-400 py-8">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-muted-foreground dark:text-gray-400 py-8">
              {t("content.noComments")}
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.userProfilePic} />
                    <AvatarFallback className={
                      comment.userRole === "athlete" ? "bg-blue-100 text-blue-800" : 
                      comment.userRole === "team" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-green-100 text-green-800"
                    }>
                      {getInitials(comment.userName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted p-3 rounded-lg dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm dark:text-white">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground dark:text-gray-400">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm dark:text-gray-300">{comment.text}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 pl-1">
                      <button 
                        onClick={() => toggleLike(comment.id)}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                      >
                        <ThumbsUp className={`h-3 w-3 ${comment.userLiked ? "fill-current text-primary dark:text-blue-400" : ""}`} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                      >
                        <Reply className="h-3 w-3" />
                        {t("content.replies")}
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="pl-4 mt-2 space-y-3 border-l-2 border-muted dark:border-gray-700">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarImage src={reply.userProfilePic} />
                              <AvatarFallback className={
                                reply.userRole === "athlete" ? "bg-blue-100 text-blue-800" : 
                                reply.userRole === "team" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-green-100 text-green-800"
                              }>
                                {getInitials(reply.userName)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="bg-muted p-2 rounded-lg dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-xs dark:text-white">{reply.userName}</span>
                                  <span className="text-xs text-muted-foreground dark:text-gray-400">
                                    {formatTimestamp(reply.timestamp)}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs dark:text-gray-300">{reply.text}</p>
                              </div>
                              
                              <button 
                                onClick={() => toggleLike(comment.id, true, reply.id)}
                                className="text-xs flex items-center gap-1 mt-1 text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white"
                              >
                                <ThumbsUp className={`h-3 w-3 ${reply.userLiked ? "fill-current text-primary dark:text-blue-400" : ""}`} />
                                {reply.likes > 0 && <span>{reply.likes}</span>}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply input */}
                    {replyingTo === comment.id && (
                      <div className="flex items-end gap-2 mt-2">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={user?.profilePic} />
                          <AvatarFallback className={
                            user?.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                            user?.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-green-100 text-green-800"
                          }>
                            {getInitials(user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <Textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={t("content.writeComment")}
                            className="min-h-[60px] text-xs resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setReplyingTo(null)}
                              className="h-7 px-2 text-xs dark:border-gray-700 dark:text-gray-300"
                            >
                              {t("content.cancel")}
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handlePostReply(comment.id)}
                              className="h-7 px-3 text-xs"
                              disabled={!replyText.trim()}
                            >
                              {t("content.postComment")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t dark:border-gray-800 pt-3 pb-1 space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className={
                user?.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                user?.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                "bg-green-100 text-green-800"
              }>
                {getInitials(user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={user ? t("content.writeComment") : "Sign in to comment"}
                className="min-h-[80px] resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled={!user}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePostComment}
              disabled={!comment.trim() || !user}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
            >
              {t("content.postComment")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentSection;
