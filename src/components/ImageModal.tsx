
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageModal = ({ isOpen, onClose, imageSrc }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
        <div className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white z-10"
          >
            <X className="h-5 w-5" />
          </Button>
          <img 
            src={imageSrc} 
            alt="Expanded post" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            style={{ imageRendering: 'crisp-edges' }}
            loading="eager"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
