import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePosts } from "@/context/PostContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContentFeed from "@/components/ContentFeed";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit2, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshPosts } = usePosts();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId || user?.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId || user?.id) {
      fetchProfile();
    }
  }, [userId, user?.id]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-gray-500">Profile not found</div>;
  }

  const isOwnProfile = !userId || userId === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('profile')}
            </h1>
            {isOwnProfile && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditProfile}
                >
                  <Edit2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSettings}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.full_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.full_name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {profile.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">
              {t('posts')}
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">
              {t('saved')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <ContentFeed
              userId={userId || user?.id}
              showAllPosts={false}
            />
          </TabsContent>
          <TabsContent value="saved">
            <ContentFeed
              userId={userId || user?.id}
              showAllPosts={false}
              contentType="saved"
            />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
