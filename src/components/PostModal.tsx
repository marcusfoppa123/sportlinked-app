import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: any;
}

const PostModal: React.FC<PostModalProps> = ({ open, onClose, post }) => {
  const navigate = useNavigate();
  if (!post) return null;

  // Helper to extract hashtags from content
  const extractHashtags = (text: string) => {
    if (!text) return [];
    return Array.from(new Set((text.match(/#(\w+)/g) || []).map(tag => tag.slice(1))));
  };

  const handleHashtagClick = (tag: string) => {
    navigate(`/hashtag/${tag}`);
  };

  const hashtags = Array.isArray(post.hashtags) && post.hashtags.length > 0
    ? post.hashtags
    : extractHashtags(post.content || "");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 border-none bg-white dark:bg-black">
        {/* Top bar with exit arrow, avatar, username */}
        <div className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <button onClick={onClose} className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6 text-black dark:text-white" />
          </button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user?.profilePic} />
            <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-semibold text-black dark:text-white">{post.user?.name || "User"}</span>
        </div>
        {/* Image/video */}
        <div className="w-full flex items-center justify-center bg-white dark:bg-black" style={{ aspectRatio: '1/1' }}>
          {post.image_url ? (
            <img 
              src={post.image_url} 
              alt="Post" 
              className="object-contain max-h-[60vh] max-w-full mx-auto" 
              style={{ imageRendering: 'crisp-edges' }}
              loading="eager"
            />
          ) : post.video_url ? (
            <video src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto" controls autoPlay />
          ) : null}
        </div>
        {/* Icons row */}
        <div className="w-full flex flex-row justify-start gap-6 px-4 py-2 bg-white dark:bg-black">
          <button className="flex items-center text-black dark:text-white"><Heart className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white"><MessageCircle className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white"><Share2 className="h-6 w-6" /></button>
          <button className="flex items-center text-black dark:text-white ml-auto"><Bookmark className="h-6 w-6" /></button>
        </div>
        {/* Liked by line */}
        <div className="px-4 text-sm text-gray-700 dark:text-gray-300 pb-1">
          Liked by <span className="font-semibold">dark_emeralds</span> and others
        </div>
        {/* Post text (bio), hashtags, comments placeholder */}
        <div className="w-full px-4 pb-4 text-black dark:text-white text-left">
          <span className="font-semibold mr-2">{post.user?.name || "User"}</span>
          <span className="whitespace-pre-line break-words">{post.content || post.bio || ""}</span>
          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {hashtags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-inherit cursor-pointer hover:underline"
                  onClick={() => handleHashtagClick(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {/* Comments placeholder */}
          <div className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Comments coming soon...</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal; 