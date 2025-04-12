
import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

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
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userId: "user1",
      userName: "John Smith",
      userRole: "athlete",
      text: "Great skills! Would love to connect and discuss opportunities.",
      timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      likes: 5,
      userLiked: false,
      replies: [
        {
          id: "reply1",
          userId: "user3",
          userName: "Coach Wilson",
          userRole: "scout",
          text: "I agree. Amazing talent on display!",
          timestamp: new Date(Date.now() - 3600000 * 12), // 12 hours ago
          likes: 2,
          userLiked: false,
        }
      ]
    },
    {
      id: "2",
      userId: "user2",
      userName: "Sarah Johnson",
      userRole: "team",
      text: "Impressive performance in the last game. Keep it up!",
      timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
      likes: 3,
      userLiked: true,
      replies: []
    }
  ]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user?.id || "current-user",
      userName: user?.name || "You",
      userRole: user?.role || "athlete",
      userProfilePic: user?.profilePic,
      text: comment,
      timestamp: new Date(),
      likes: 0,
      userLiked: false,
      replies: []
    };
    
    setComments([newComment, ...comments]);
    setComment("");
    toast.success("Comment posted successfully");
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;
    
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      userId: user?.id || "current-user",
      userName: user?.name || "You",
      userRole: user?.role || "athlete",
      userProfilePic: user?.profilePic,
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
          {comments.length === 0 ? (
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
                placeholder={t("content.writeComment")}
                className="min-h-[80px] resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePostComment}
              disabled={!comment.trim()}
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
