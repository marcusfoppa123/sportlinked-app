import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { postSchema } from "@/utils/validation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Image, Paperclip, Video, Hash, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const CreatePost = () => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  
  const [postText, setPostText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleBack = () => {
    navigate('/profile');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: string[] = [];
    const newImageFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newImageFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result.toString());
          if (newImages.length === files.length) {
            setPreviewImages([...previewImages, ...newImages]);
            setImageFiles([...imageFiles, ...newImageFiles]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVideoFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewVideo(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveVideo = () => {
    setPreviewVideo(null);
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };
  
  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };
  
  const handleRemoveHashtag = (hashtag: string) => {
    setHashtags(prev => prev.filter(h => h !== hashtag));
  };
  
  const handlePublish = async () => {
    if (!user) {
      toast.error("Please sign in to create posts");
      return;
    }
    
    if (!postText.trim() && previewImages.length === 0 && !previewVideo) {
      toast.error("Please add some content to your post");
      return;
    }

    // Validate input before publishing
    const allHashtags = Array.from(
      new Set([
        ...hashtags.map(h => h.toLowerCase().replace(/^#/, '')),
        ...(postText.match(/#(\w+)/g) || []).map(tag => tag.slice(1).toLowerCase())
      ])
    );

    const validationResult = postSchema.safeParse({
      content: postText.trim() || undefined,
      hashtags: allHashtags.length > 0 ? allHashtags : undefined,
      sport: selectedSport || undefined,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }
    
    try {
      setUploading(true);
      
      // Handle file uploads if any
      let imageUrl = null;
      let videoUrl = null;
      
      if (imageFiles.length > 0) {
        // For simplicity, we'll just upload the first image
        const file = imageFiles[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('posts')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, videoFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
          
        videoUrl = publicUrl;
      }
      
      // Extract hashtags from postText (lowercase, no duplicates)
      const extracted = Array.from(
        new Set(
          (postText.match(/#(\w+)/g) || [])
            .map(tag => tag.slice(1).toLowerCase())
        )
      );
      // Merge with manually added hashtags (also lowercase)
      const allHashtags = Array.from(
        new Set([
          ...hashtags.map(h => h.toLowerCase()),
          ...extracted
        ])
      );
      
      // Create post in database
      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postText.trim() ? postText : null,
          image_url: imageUrl,
          video_url: videoUrl,
          sport: selectedSport || null,
          hashtags: allHashtags.length > 0 ? allHashtags : null
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Update profile post count
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ posts: (user.posts || 0) + 1 })
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error updating profile post count:', profileError);
      }
      
      // Update local user state
      if (updateUserProfile) {
        updateUserProfile({ posts: (user.posts || 0) + 1 });
      }
      
      toast.success("Post published successfully!");
      navigate("/for-you");
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900 flex flex-col items-center`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm w-full">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold dark:text-white">Create Post</h1>
          <Button 
            variant="default"
            onClick={handlePublish}
            className={`${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
            disabled={(!postText.trim() && previewImages.length === 0 && !previewVideo) || uploading}
          >
            {uploading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </header>
      {/* Main content - Modern Instagram-like style */}
      <div className="w-full flex-1 flex flex-col items-center justify-start px-0 py-4">
        <div className="w-full max-w-md mx-auto">
          {/* Media upload area */}
          <div className="mb-4">
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl shadow overflow-hidden flex items-center justify-center">
              {/* Show preview image or video, or upload prompt */}
              {previewImages.length > 0 ? (
                <img src={previewImages[0]} alt="Preview" className="object-cover w-full h-full" />
              ) : previewVideo ? (
                <video src={previewVideo} controls className="object-cover w-full h-full" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <Image className="h-12 w-12 mb-2" />
                  <span className="text-base">Add Photo or Video</span>
                </div>
              )}
              {/* Remove media button */}
              {(previewImages.length > 0 || previewVideo) && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80"
                  onClick={previewImages.length > 0 ? () => handleRemoveImage(0) : handleRemoveVideo}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              {/* Upload buttons overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/80 hover:bg-white text-blue-600 border border-blue-200 shadow"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={!!previewVideo}
                  className="bg-white/80 hover:bg-white text-blue-600 border border-blue-200 shadow"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          {/* Card for post details */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow">
            <CardHeader className="flex-row items-center space-y-0 gap-3">
              <Avatar>
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback className={
                  user?.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                  user?.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-green-100 text-green-800"
                }>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium dark:text-white">{user?.name}</div>
                <div className="flex items-center">
                  <Badge variant="outline" className="h-5 dark:border-gray-600 dark:text-gray-300">
                    {user?.role}
                  </Badge>
                  {user?.sport && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {user.sport} • {user.position || "Player"}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write a caption..."
                className="border-none shadow-none resize-none min-h-[80px] focus-visible:ring-0 p-0 text-lg dark:bg-gray-800 dark:text-white"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              {/* Sport selection */}
              <div className="flex items-center gap-2">
                <Label className="text-gray-500 dark:text-gray-400">Sport:</Label>
                <Select
                  value={selectedSport}
                  onValueChange={setSelectedSport}
                >
                  <SelectTrigger className="w-32 h-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag) => (
                    <Badge 
                      key={hashtag} 
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1 dark:bg-gray-700 dark:text-white"
                    >
                      #{hashtag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveHashtag(hashtag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              {/* Hashtag input */}
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Add hashtag..."
                  className="flex-1 border-none shadow-none focus-visible:ring-0 dark:bg-gray-800 dark:text-white"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value.replace(/\s+/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddHashtag}
                  disabled={!hashtagInput.trim()}
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
