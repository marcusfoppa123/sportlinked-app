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
      <DialogContent className="max-w-2xl w-full h-screen p-0 flex flex-col md:flex-row overflow-hidden bg-black">
        <div className="flex-1 flex items-center justify-center bg-black">
          {post.image_url ? (
            <img src={post.image_url} alt="Post" className="object-contain max-h-full max-w-full" />
          ) : post.video_url ? (
            <video src={post.video_url} className="object-contain max-h-full max-w-full" controls autoPlay />
          ) : null}
        </div>
        <div className="flex flex-col justify-between items-center w-20 py-8 bg-black/60 text-white">
          <div />
          <div className="flex flex-col gap-6 items-center">
            <button className="flex flex-col items-center">
              <Heart className="h-8 w-8" />
              <span className="text-sm mt-1">{post.stats?.likes ?? 0}</span>
            </button>
            <button className="flex flex-col items-center">
              <MessageCircle className="h-8 w-8" />
              <span className="text-sm mt-1">{post.stats?.comments ?? 0}</span>
            </button>
            <button className="flex flex-col items-center">
              <Bookmark className="h-8 w-8" />
              <span className="text-sm mt-1">{post.stats?.bookmarks ?? 0}</span>
            </button>
            <button className="flex flex-col items-center">
              <Share2 className="h-8 w-8" />
              <span className="text-sm mt-1">{post.stats?.shares ?? 0}</span>
            </button>
          </div>
          <div />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal; 