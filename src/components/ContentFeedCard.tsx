import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
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
  isVideoVisible?: boolean;
  hashtags?: string[];
}

const ContentFeedCard = ({
  id,
  user,
  timestamp,
  content,
  stats,
  userLiked,
  userBookmarked,
  onDelete,
  isVideoVisible = true,
  hashtags,
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
    navigate(`/user/${user.id}`);
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
    <Card className="w-full max-w-xl mx-auto rounded-2xl card-shadow border border-blue-100 bg-white dark:bg-gray-900" style={{ margin: 0 }}>
      {/* User info header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Avatar
          className="h-11 w-11 cursor-pointer border-2 border-blue-200"
          onClick={handleProfileClick}
        >
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold cursor-pointer hover:underline text-blue-700 dark:text-blue-300 truncate"
              onClick={handleProfileClick}
            >
              {user.name}
            </span>
            <Badge className="athlete-badge text-xs px-2 py-0.5">{user.role}</Badge>
          </div>
          <span className="text-xs text-gray-400">{formatTimestamp(timestamp)}</span>
        </div>
      </div>

      {/* Post image */}
      {content.image && (
        <img
          src={content.image}
          alt="Post content"
          className="w-full max-h-96 object-cover rounded-t-2xl border-b border-blue-50"
          style={{ aspectRatio: '1/1', background: '#eaf1fb' }}
        />
      )}
      {/* Post video */}
      {content.video && (
        <TikTokVideo
          src={content.video}
          className="w-full object-contain rounded-t-2xl border-b border-blue-50"
          isVisible={isVideoVisible}
        />
      )}

      {/* Post text */}
      {content.text && (
        <div className="px-4 py-3 text-base text-gray-900 dark:text-gray-100 whitespace-pre-line break-words">
          {content.text}
        </div>
      )}

      {/* Hashtags */}
      {(Array.isArray(hashtags) && hashtags.length > 0 ? hashtags : (content?.text?.match(/#(\w+)/g) || []).map(tag => tag.slice(1))).length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 ml-4">
          {(Array.isArray(hashtags) && hashtags.length > 0 ? hashtags : (content?.text?.match(/#(\w+)/g) || []).map(tag => tag.slice(1))).map((tag: string) => (
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

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-blue-50 bg-blue-50/40 dark:bg-blue-950/30 rounded-b-2xl">
        <PostInteractions
          postId={id}
          initialLikes={stats.likes}
          initialComments={stats.comments}
          initialBookmarks={0}
          initialUserLiked={userLiked}
          initialUserBookmarked={userBookmarked}
          onCommentClick={() => setCommentsOpen(true)}
        />
      </div>

      {/* Comments section (modal or below) */}
      <CommentSection
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={id}
      />
    </Card>
  );
};

export default ContentFeedCard;
