import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContentFeedCard from "@/components/ContentFeedCard";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AnimatedLoadingScreen from "@/components/AnimatedLoadingScreen";
import ProfilePostThumbnail from "@/components/ProfilePostThumbnail";
import { Folder, Plus, Settings } from "lucide-react";

interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  bookmarks: any[];
}

const SavedItems = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  const isScout = user?.role === "scout";
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSavedData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);

        // For now, use simplified approach until types are updated
        const { data: bookmarks, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(`
            post_id,
            folder_id,
            posts!inner(*)
          `)
          .eq('user_id', user.id) as any;

        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
          throw bookmarksError;
        }

        if (!bookmarks || bookmarks.length === 0) {
          setFolders([{
            id: 'all',
            name: 'All Bookmarks',
            color: '#6B7280',
            bookmarks: []
          }]);
          setSelectedFolder('all');
          setLoading(false);
          return;
        }

        // Process posts with additional data
        const postsWithStats = await Promise.all(
          bookmarks.map(async (bookmark: any) => {
            const post = bookmark.posts;
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url, role')
              .eq('id', post.user_id)
              .maybeSingle();

            const { count: likesCount } = await supabase
              .from('likes')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);

            return {
              ...post,
              folder_id: bookmark.folder_id,
              user: {
                id: post.user_id,
                name: profileData?.full_name || 'Unknown User',
                role: profileData?.role || 'athlete',
                profilePic: profileData?.avatar_url
              },
              content: {
                text: post.content,
                image: post.image_url,
                video: post.video_url
              },
              stats: {
                likes: likesCount || 0,
                comments: 0,
                shares: 0
              }
            };
          })
        );

        if (isScout) {
          // Group by folders for scouts
          const folderMap = new Map<string, BookmarkFolder>();
          
          // Add "All Bookmarks" folder
          folderMap.set('all', {
            id: 'all',
            name: 'All Bookmarks',
            color: '#6B7280',
            bookmarks: postsWithStats
          });

          // Group posts by folder_id
          postsWithStats.forEach(post => {
            const folderId = post.folder_id || 'general';
            if (folderId !== 'all' && !folderMap.has(folderId)) {
              folderMap.set(folderId, {
                id: folderId,
                name: 'General', // Will be updated when we fetch folder names
                color: '#3B82F6',
                bookmarks: []
              });
            }
            if (folderId !== 'all') {
              const folder = folderMap.get(folderId);
              if (folder) {
                folder.bookmarks.push(post);
              }
            }
          });

          setFolders(Array.from(folderMap.values()));
          setSelectedFolder('all');
        } else {
          // Simple view for non-scouts
          setFolders([{
            id: 'all',
            name: 'All Bookmarks',
            color: '#6B7280',
            bookmarks: postsWithStats
          }]);
          setSelectedFolder('all');
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
        toast.error('Failed to load saved posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedData();
  }, [user?.id, isScout]);

  const selectedFolderData = folders.find(f => f.id === selectedFolder);
  const postsToShow = selectedFolderData?.bookmarks || [];

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Saved Items</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        {loading ? (
          <AnimatedLoadingScreen isLoading={loading} onComplete={() => {}} />
        ) : (
          <>
            {/* Folder navigation for scouts */}
            {isScout && folders.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold dark:text-white">Folders</h2>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={selectedFolder === folder.id ? "default" : "outline"}
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: folder.color }}
                      />
                      {folder.name}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {folder.bookmarks.length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts grid */}
            {postsToShow.length > 0 ? (
              <div className="grid grid-cols-2 gap-1">
                {postsToShow.map(post => (
                  <ProfilePostThumbnail
                    key={post.id}
                    post={{
                      id: post.id,
                      image_url: post.content.image,
                      video_url: post.content.video,
                      likeCount: post.stats.likes || 0,
                    }}
                    canDelete={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No saved posts yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  {isScout 
                    ? "Bookmark posts to organize them into folders" 
                    : "Bookmark posts to save them for later"
                  }
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SavedItems;