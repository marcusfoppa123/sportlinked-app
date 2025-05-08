import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePosts } from "@/context/PostContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AthleteContent from "@/components/AthleteContent";
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
  const [postCount, setPostCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const targetUserId = userId || user?.id;
        
        if (!targetUserId) {
          toast.error('User not found');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            followers:profile_followers(count),
            following:profile_following(count)
          `)
          .eq('id', targetUserId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
          setLoading(false);
          return;
        }

        if (!data) {
          toast.error('Profile not found');
          setLoading(false);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user?.id]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-8">
          <div className="text-center py-8 text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Profile not found. Please try again later.
          </div>
        </div>
      </div>
    );
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
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.full_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {profile.full_name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {profile.role}
              </p>
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {postCount}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('posts')}
                  </div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile.followers?.[0]?.count || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('followers')}
                  </div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile.following?.[0]?.count || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('following')}
                  </div>
                </div>
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
            <AthleteContent
              userId={userId || user?.id}
              onPostCount={setPostCount}
            />
          </TabsContent>
          <TabsContent value="saved">
            <AthleteContent
              userId={userId || user?.id}
              contentType="profiles"
            />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
