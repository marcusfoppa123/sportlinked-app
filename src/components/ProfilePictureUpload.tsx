
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  profilePic?: string;
  name?: string;
  role?: string;
  onImageChange: (image: string | undefined) => void;
  triggerComponent?: React.ReactNode;
}

const ProfilePictureUpload = ({ 
  profilePic, 
  name, 
  role = "athlete",
  onImageChange,
  triggerComponent
}: ProfilePictureUploadProps) => {
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
          toast.success("Profile picture updated");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
    toast.success("Profile picture removed");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Avatar className="h-24 w-24 cursor-pointer hover:opacity-90 transition-opacity border-4 border-white dark:border-gray-800">
            <AvatarImage src={profilePic} />
            <AvatarFallback className={`text-xl ${
              role === "athlete" ? "bg-blue-100 text-blue-800" : 
              role === "team" ? "bg-yellow-100 text-yellow-800" : 
              "bg-green-100 text-green-800"
            }`}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        )}
      </DialogTrigger>
      
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{t("profile.changePicture")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-700">
            <AvatarImage src={profilePic} />
            <AvatarFallback className={`text-3xl ${
              role === "athlete" ? "bg-blue-100 text-blue-800" : 
              role === "team" ? "bg-yellow-100 text-yellow-800" : 
              "bg-green-100 text-green-800"
            }`}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="grid grid-cols-1 gap-3 w-full">
            <Button 
              onClick={handleOpenFileDialog}
              className="flex items-center justify-center gap-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <Upload className="h-4 w-4" />
              {t("profile.uploadNew")}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleOpenFileDialog}
              className="flex items-center justify-center gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Image className="h-4 w-4" />
              {t("profile.selectFromLibrary")}
            </Button>
            
            {profilePic && (
              <Button 
                variant="destructive" 
                onClick={handleRemoveImage}
                className="flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t("profile.remove")}
              </Button>
            )}
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureUpload;
