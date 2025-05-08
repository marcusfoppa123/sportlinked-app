import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Trash2, MoreVertical } from "lucide-react";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface ContentFeedCardProps {
  id: string;
  content: {
    text: string;
    image?: string | null;
    video?: string | null;
  };
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    role: string;
  };
  timestamp: Date;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  userLiked: boolean;
  userBookmarked: boolean;
  sport?: string | null;
  hashtags?: string[];
}

const ContentFeedCard = ({
  id,
  content,
  user,
  timestamp,
  stats,
  userLiked,
  userBookmarked,
  sport,
  hashtags
}: ContentFeedCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const { likePost, unlikePost, bookmarkPost, unbookmarkPost, deletePost } = usePosts();
  const [isLiked, setIsLiked] = useState(userLiked);
  const [isBookmarked, setIsBookmarked] = useState(userBookmarked);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleLike = async () => {
    if (!currentUser) {
      toast.error(t('pleaseSignIn'));
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(id);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likePost(id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      toast.error(t('pleaseSignIn'));
      return;
    }

    try {
      if (isBookmarked) {
        await unbookmarkPost(id);
      } else {
        await bookmarkPost(id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;

    try {
      await deletePost(id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleComment = () => {
    navigate(`/post/${id}`);
  };

  const handleProfileClick = () => {
    navigate(`/profile?userId=${user.id}`);
  };

  return (
    <>
      <Card className="mb-4 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="p-4 pb-3 flex flex-row items-center space-y-0 gap-3">
          <Avatar 
            className="h-10 w-10 cursor-pointer" 
            onClick={handleProfileClick}
          >
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center">
              <div 
                className="font-medium cursor-pointer hover:underline dark:text-white" 
                onClick={handleProfileClick}
              >
                {user.name}
              </div>
              <Badge variant="outline" className="ml-2 h-5 dark:border-gray-600 dark:text-gray-300">
                {user.role}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </div>
          </div>
          {currentUser?.id === user.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-0 space-y-3">
          {content.text && (
            <div className="text-sm dark:text-gray-200">{content.text}</div>
          )}
          
          {content.image && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={content.image} 
                alt="Post content" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {content.video && (
            <div className="rounded-lg overflow-hidden">
              <video 
                src={content.video} 
                controls 
                className="w-full h-auto"
              />
            </div>
          )}
          
          {sport && (
            <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm mt-2">
              {sport}
            </span>
          )}
          
          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-500 dark:text-blue-400 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 pt-0 pb-3 flex justify-between">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`px-2 dark:hover:bg-gray-700 ${
                isLiked ? "text-blue-500 dark:text-blue-400" : "dark:text-gray-300"
              }`}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCommentsOpen(true)}
              className="px-2 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">{stats.comments}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">{stats.shares}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBookmark}
            className={`px-2 dark:hover:bg-gray-700 ${
              isBookmarked ? "text-blue-500 dark:text-blue-400" : "dark:text-gray-300"
            }`}
            aria-label={isBookmarked ? "Remove from saved items" : "Save to your items"}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Comment Section Dialog */}
      <CommentSection 
        isOpen={commentsOpen} 
        onClose={() => setCommentsOpen(false)} 
        postId={id}
      />

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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ContentFeedCard;
