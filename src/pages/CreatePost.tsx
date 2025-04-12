
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Image, Video, Upload, X, ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"image" | "video">("image");
  const [sport, setSport] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFilePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error(t("content.fileRequired"));
      return;
    }
    
    if (!content.trim()) {
      toast.error(t("content.descriptionRequired"));
      return;
    }
    
    if (!sport) {
      toast.error(t("content.sportRequired"));
      return;
    }
    
    // Here you would handle the actual post creation
    // This would typically involve an API call
    
    toast.success(t("content.postCreated"));
    navigate("/for-you");
  };
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold dark:text-white">{t("content.createPost")}</h1>
          <div className="w-9"></div> {/* Empty div for spacing */}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container px-4 py-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t("content.newPost")}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* File upload */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4 mb-2">
                  <Button
                    type="button"
                    variant={contentType === "image" ? "default" : "outline"}
                    onClick={() => setContentType("image")}
                    className="flex items-center space-x-2"
                  >
                    <Image className="h-4 w-4" />
                    <span>{t("content.image")}</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={contentType === "video" ? "default" : "outline"}
                    onClick={() => setContentType("video")}
                    className="flex items-center space-x-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>{t("content.video")}</span>
                  </Button>
                </div>
                
                {filePreview ? (
                  <div className="relative">
                    {contentType === "image" ? (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-full rounded-md object-cover max-h-64"
                      />
                    ) : (
                      <video 
                        src={filePreview} 
                        controls 
                        className="w-full rounded-md max-h-64"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleClearFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <Input 
                      id="file" 
                      type="file" 
                      className="hidden"
                      onChange={handleFileChange}
                      accept={contentType === "image" ? "image/*" : "video/*"}
                    />
                    <label 
                      htmlFor="file" 
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {contentType === "image" 
                          ? t("content.uploadImage") 
                          : t("content.uploadVideo")}
                      </span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  {t("content.description")}
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("content.descriptionPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Hashtags */}
              <div className="space-y-2">
                <label htmlFor="hashtags" className="text-sm font-medium">
                  {t("content.hashtags")}
                </label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder={t("content.hashtagsPlaceholder")}
                />
              </div>
              
              {/* Sport */}
              <div className="space-y-2">
                <label htmlFor="sport" className="text-sm font-medium">
                  {t("content.sport")}
                </label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger id="sport">
                    <SelectValue placeholder={t("content.selectSport")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
              >
                {t("content.postContent")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;
