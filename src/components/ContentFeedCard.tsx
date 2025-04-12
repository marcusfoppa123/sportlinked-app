
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Share, Bookmark } from "lucide-react";
import CommentSection from "./CommentSection";

interface ContentFeedCardProps {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
    profilePic?: string;
  };
  timestamp: Date;
  content: {
    text?: string;
    image?: string;
    video?: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  userLiked: boolean;
  userBookmarked: boolean;
}

const ContentFeedCard = ({
  id,
  user,
  timestamp,
  content,
  stats,
  userLiked,
  userBookmarked
}: ContentFeedCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(userLiked);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [isBookmarked, setIsBookmarked] = useState(userBookmarked);
  const [commentsOpen, setCommentsOpen] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleProfileClick = () => {
    if (user.role === "team") {
      navigate("/team-profile");
    } else {
      navigate("/profile");
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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
    <>
      <Card className="mb-4 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="p-4 pb-3 flex flex-row items-center space-y-0 gap-3">
          <Avatar 
            className="h-10 w-10 cursor-pointer" 
            onClick={handleProfileClick}
          >
            <AvatarImage src={user.profilePic} />
            <AvatarFallback className={
              user.role === "athlete" ? "bg-blue-100 text-blue-800" : 
              user.role === "team" ? "bg-yellow-100 text-yellow-800" : 
              "bg-green-100 text-green-800"
            }>
              {getInitials(user.name)}
            </AvatarFallback>
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
              {formatTimestamp(timestamp)}
            </div>
          </div>
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
              <Share className="h-4 w-4 mr-1" />
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
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
      
      <CommentSection 
        isOpen={commentsOpen} 
        onClose={() => setCommentsOpen(false)} 
        postId={id}
      />
    </>
  );
};

export default ContentFeedCard;
