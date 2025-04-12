
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Image, Video, X, Upload } from "lucide-react";
import { toast } from "sonner";

const CreatePost = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  
  const [postType, setPostType] = useState<"image" | "video" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [sport, setSport] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !postType || !sport || !mediaPreview) {
      toast.error(t("createPost.fillAllFields"));
      return;
    }
    
    // Mock posting to backend
    toast.success(t("createPost.postCreated"));
    
    // In a real app, you would save to your backend here
    // For now, we'll just navigate back
    navigate("/profile");
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  if (!isAthlete) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="min-h-screen pb-16 athlete-theme dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="dark:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold dark:text-white">{t("createPost.createPost")}</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{t("createPost.createNewPost")}</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {!postType ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex flex-col h-24 p-2 dark:border-gray-600 dark:text-white"
                    onClick={() => setPostType("image")}
                  >
                    <Image className="h-8 w-8 mb-2 text-athlete" />
                    <span className="text-xs">{t("createPost.image")}</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex flex-col h-24 p-2 dark:border-gray-600 dark:text-white"
                    onClick={() => setPostType("video")}
                  >
                    <Video className="h-8 w-8 mb-2 text-athlete" />
                    <span className="text-xs">{t("createPost.video")}</span>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="dark:text-white">{t("createPost.title")}</Label>
                    <Input 
                      id="title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("createPost.titlePlaceholder")}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="dark:text-white">{t("createPost.description")}</Label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("createPost.descriptionPlaceholder")}
                      rows={3}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hashtags" className="dark:text-white">{t("createPost.hashtags")}</Label>
                    <Input 
                      id="hashtags" 
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder={t("createPost.hashtagsPlaceholder")}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sport" className="dark:text-white">{t("createPost.sport")}</Label>
                    <Select value={sport} onValueChange={setSport}>
                      <SelectTrigger id="sport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder={t("createPost.selectSport")} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="baseball">Baseball</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="media" className="dark:text-white">
                      {postType === "image" ? t("createPost.uploadImage") : t("createPost.uploadVideo")}
                    </Label>
                    
                    {!mediaPreview ? (
                      <div className="border border-dashed rounded-md p-6 text-center dark:border-gray-600">
                        <Input 
                          id="media" 
                          type="file" 
                          className="hidden"
                          accept={postType === "image" ? "image/*" : "video/*"}
                          onChange={handleFileChange}
                        />
                        <Label 
                          htmlFor="media" 
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <Upload className="h-10 w-10 mb-2 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {postType === "image" 
                              ? t("createPost.clickToUploadImage") 
                              : t("createPost.clickToUploadVideo")
                            }
                          </span>
                        </Label>
                      </div>
                    ) : (
                      <div className="relative">
                        {postType === "image" ? (
                          <img 
                            src={mediaPreview} 
                            alt="Preview" 
                            className="w-full h-auto rounded-md object-cover"
                          />
                        ) : (
                          <video 
                            src={mediaPreview}
                            controls
                            className="w-full h-auto rounded-md"
                          />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setMediaPreview(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            
            {postType && (
              <CardFooter className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 dark:border-gray-600 dark:text-white"
                  onClick={handleCancel}
                >
                  {t("createPost.cancel")}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-athlete hover:bg-athlete/90"
                >
                  {t("createPost.post")}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreatePost;
