import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePosts } from "@/context/PostContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { refreshPosts } = usePosts();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [sport, setSport] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setLoading(true);

      let imageUrl = null;
      let videoUrl = null;

      if (image) {
        const imageExt = image.name.split('.').pop();
        const imagePath = `${user.id}/${Date.now()}.${imageExt}`;
        const { error: imageError } = await supabase.storage
          .from('post-images')
          .upload(imagePath, image);
        
        if (imageError) throw imageError;
        
        const { data: imageData } = supabase.storage
          .from('post-images')
          .getPublicUrl(imagePath);
        
        imageUrl = imageData.publicUrl;
      }

      if (video) {
        const videoExt = video.name.split('.').pop();
        const videoPath = `${user.id}/${Date.now()}.${videoExt}`;
        const { error: videoError } = await supabase.storage
          .from('post-videos')
          .upload(videoPath, video);
        
        if (videoError) throw videoError;
        
        const { data: videoData } = supabase.storage
          .from('post-videos')
          .getPublicUrl(videoPath);
        
        videoUrl = videoData.publicUrl;
      }

      const hashtagArray = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'));

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          image_url: imageUrl,
          video_url: videoUrl,
          sport,
          hashtags: hashtagArray
        });

      if (error) throw error;

      await refreshPosts();
      toast.success('Post created successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('createPost')}
          </h1>
        </div>
      </header>

      <main className="container px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">{t('content')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('whatsOnYourMind')}
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t('image')}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">{t('video')}</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport">{t('sport')}</Label>
            <Input
              id="sport"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder={t('enterSport')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">{t('hashtags')}</Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder={t('enterHashtags')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('creating') : t('create')}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
