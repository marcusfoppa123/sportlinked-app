import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfilePostThumbnailProps {
  post: {
    id: string;
    image_url?: string;
    video_url?: string;
    likeCount: number;
  };
  onDelete?: () => void;
  canDelete?: boolean;
}

const ProfilePostThumbnail: React.FC<ProfilePostThumbnailProps> = ({ post, onDelete, canDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div 
      className="relative aspect-square cursor-pointer group"
      onClick={handleClick}
    >
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ imageRendering: 'crisp-edges' }}
        />
      )}
      {post.video_url && (
        <video
          src={post.video_url}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      )}
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="text-white text-sm">
          {post.likeCount} likes
        </div>
      </div>

      {canDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProfilePostThumbnail; 