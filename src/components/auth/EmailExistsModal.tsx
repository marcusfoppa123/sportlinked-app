
import React from "react";
import {
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EmailExistsModalProps = {
  open: boolean;
  onClose: () => void;
}

const EmailExistsModal = ({ open, onClose }: EmailExistsModalProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-xs mx-auto text-center">
      <DialogHeader>
        <DialogTitle className="text-red-600">Account Already Exists</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-base text-gray-800 dark:text-gray-100">
        There is already an active account connected to this email.
      </div>
      <Button className="w-full mt-2" onClick={onClose}>
        OK
      </Button>
    </DialogContent>
  </Dialog>
);

export default EmailExistsModal;
