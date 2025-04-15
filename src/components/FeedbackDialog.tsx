
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star as StarIcon, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please provide some feedback text");
      return;
    }

    if (!user || !user.id) {
      toast.error("You must be logged in to provide feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        content,
        rating
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setContent("");
      setRating(null);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value: string) => {
    setRating(parseInt(value, 10));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve SportLinked by sharing your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating" className="block">How would you rate your experience?</Label>
            <RadioGroup value={rating?.toString()} onValueChange={handleRatingChange} className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center space-y-1">
                  <RadioGroupItem 
                    value={value.toString()} 
                    id={`rating-${value}`} 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor={`rating-${value}`}
                    className={`cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${rating === value ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    <StarIcon className="w-6 h-6" />
                  </Label>
                  <span className="text-xs">{value}</span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your feedback</Label>
            <Textarea 
              id="feedback" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us what you think about SportLinked..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={user?.role === "athlete" ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}
          >
            {isSubmitting ? "Submitting..." : "Send Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
