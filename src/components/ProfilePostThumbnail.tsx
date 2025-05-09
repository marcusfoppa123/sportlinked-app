import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Video, Image as ImageIcon } from "lucide-react";
import TikTokVideo from "@/components/TikTokVideo";

interface ProfilePostThumbnailProps {
  postId: string;
  image?: string;
  video?: string;
  likeCount?: number;
}

const ProfilePostThumbnail: React.FC<ProfilePostThumbnailProps> = ({ postId, image, video, likeCount = 0 }) => {
  const navigate = useNavigate();
  const isVideo = !!video;
  const isImage = !!image && !video;

  return (
    <div
      className="aspect-square w-full bg-gray-200 dark:bg-gray-800 cursor-pointer overflow-hidden relative"
      onClick={() => navigate(`/post/${postId}`)}
    >
      {image ? (
        <img
          src={image}
          alt="Post thumbnail"
          className="object-cover w-full h-full"
        />
      ) : video ? (
        <TikTokVideo
          src={video}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">No Media</div>
      )}
      {/* Top right overlay for media type */}
      {(isVideo || isImage) && (
        <div className="absolute top-1 right-1 bg-black/60 rounded-full p-1">
          {isVideo ? (
            <Video className="w-4 h-4 text-white" />
          ) : (
            <ImageIcon className="w-4 h-4 text-white" />
          )}
        </div>
      )}
      {/* Bottom right overlay for like count */}
      <div className="absolute bottom-1 right-1 bg-black/60 rounded-full flex items-center px-2 py-0.5 gap-1">
        <Heart className="w-3.5 h-3.5 text-white" fill={likeCount > 0 ? 'white' : 'none'} />
        <span className="text-xs text-white font-semibold">{likeCount}</span>
      </div>
    </div>
  );
};

export default ProfilePostThumbnail; 