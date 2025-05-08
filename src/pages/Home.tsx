import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePosts } from "@/context/PostContext";
import ContentFeed from "@/components/ContentFeed";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { refreshPosts } = usePosts();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await refreshPosts();
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load posts');
      }
    };

    loadInitialData();
  }, [refreshPosts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('home')}
          </h1>
        </div>
      </header>

      <main className="container px-4 py-4">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="feed" className="flex-1">
              {t('feed')}
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex-1">
              {t('discover')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <ContentFeed showAllPosts={true} />
          </TabsContent>
          <TabsContent value="discover">
            <ContentFeed showAllPosts={true} contentType="posts" />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home; 