import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import CommentSection from "./CommentSection";
import PostInteractions from "./PostInteractions";
import TikTokVideo from "@/components/TikTokVideo";

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
  onDelete?: () => void;
}

const ContentFeedCard = ({
  id,
  user,
  timestamp,
  content,
  stats,
  userLiked,
  userBookmarked,
  onDelete
}: ContentFeedCardProps) => {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
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
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar
          className="h-10 w-10 cursor-pointer"
          onClick={handleProfileClick}
        >
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              {user.name}
            </span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <span className="text-sm text-gray-500">{formatTimestamp(timestamp)}</span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {content.text && (
          <p className="px-4 py-2 whitespace-pre-line break-words">{content.text}</p>
        )}
        {content.image && (
          <img
            src={content.image}
            alt="Post content"
            className="w-full object-contain"
          />
        )}
        {content.video && (
          <TikTokVideo
            src={content.video}
            className="w-full object-contain rounded-xl"
          />
        )}
      </CardContent>

      <CardFooter className="p-0">
        <PostInteractions
          postId={id}
          initialLikes={stats.likes}
          initialComments={stats.comments}
          initialBookmarks={stats.shares}
          initialUserLiked={userLiked}
          initialUserBookmarked={userBookmarked}
          onDelete={onDelete}
          isOwner={currentUser?.id === user.id}
          onCommentClick={() => setCommentsOpen(true)}
        />
      </CardFooter>

      <CommentSection
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={id}
      />
    </Card>
  );
};

export default ContentFeedCard;
