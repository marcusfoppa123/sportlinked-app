import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: any;
}

const PostModal: React.FC<PostModalProps> = ({ open, onClose, post }) => {
  if (!post) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full h-screen p-0 flex flex-col items-center justify-center overflow-hidden bg-black">
        <div className="flex-1 flex items-center justify-center w-full py-8">
          {post.image_url ? (
            <img src={post.image_url} alt="Post" className="object-contain max-h-[60vh] max-w-full mx-auto" />
          ) : post.video_url ? (
            <video src={post.video_url} className="object-contain max-h-[60vh] max-w-full mx-auto" controls autoPlay />
          ) : null}
        </div>
        <div className="w-full flex flex-row justify-center gap-8 py-4 bg-black">
          <button className="flex flex-col items-center text-white">
            <Heart className="h-7 w-7" />
            <span className="text-xs mt-1">{post.stats?.likes ?? 0}</span>
          </button>
          <button className="flex flex-col items-center text-white">
            <MessageCircle className="h-7 w-7" />
            <span className="text-xs mt-1">{post.stats?.comments ?? 0}</span>
          </button>
          <button className="flex flex-col items-center text-white">
            <Bookmark className="h-7 w-7" />
            <span className="text-xs mt-1">{post.stats?.bookmarks ?? 0}</span>
          </button>
          <button className="flex flex-col items-center text-white">
            <Share2 className="h-7 w-7" />
            <span className="text-xs mt-1">{post.stats?.shares ?? 0}</span>
          </button>
        </div>
        <div className="w-full px-6 py-2 bg-black text-white text-left">
          <div className="mb-2 whitespace-pre-line break-words">{post.content || post.bio || ""}</div>
          {/* Hashtags placeholder */}
          {post.hashtags && (
            <div className="mb-2 text-blue-400">{post.hashtags}</div>
          )}
          {/* Comments placeholder */}
          <div className="mt-2 text-gray-400 text-sm">Comments coming soon...</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal; 