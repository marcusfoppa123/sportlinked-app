import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Menu, Settings, RefreshCw } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ContentFeed from "@/components/ContentFeed";
import UploadButton from "@/components/UploadButton";
import SideMenu from "@/components/SideMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/sportslinked-logo.png";
import ContentFeedCard from "@/components/ContentFeedCard";
import { supabase } from "@/integrations/supabase/client";

const ForYou = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAthlete = user?.role === "athlete";
  const [activeTab, setActiveTab] = useState("for-you");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of ContentFeed
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [location.pathname]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetch posts for the For You feed (all sports or filtered)
        let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (activeTab !== "for-you") {
          query = query.eq('sport', activeTab);
        }
        const { data: postsData, error: postsError } = await query;
        if (postsError) throw postsError;
        // Fetch all needed profiles in one query
        const userIds = Array.from(new Set((postsData || []).map((p: any) => p.user_id)));
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds);
        const profileMap = new Map((profilesData || []).map((profile: any) => [profile.id, profile]));
        // For each post, fetch stats and user state
        const postsWithStats = await Promise.all(
          (postsData || []).map(async (post: any) => {
            // Like count
            const { count: likesCount } = await supabase
              .from('likes')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);
            // Comment count
            const { count: commentsCount } = await supabase
              .from('comments')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id);
            // User liked/bookmarked
            let userLiked = false;
            let userBookmarked = false;
            if (user) {
              const { data: userLike } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user.id)
                .maybeSingle();
              userLiked = !!userLike;
              const { data: userBookmark } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user.id)
                .maybeSingle();
              userBookmarked = !!userBookmark;
            }
            // Profile
            const profileData = profileMap.get(post.user_id);
            return {
              ...post,
              user: {
                id: post.user_id,
                name: profileData?.full_name || profileData?.username || 'Unknown User',
                role: profileData?.role || 'athlete',
                profilePic: profileData?.avatar_url,
              },
              content: {
                text: post.content,
                image: post.image_url,
                video: post.video_url,
              },
              stats: {
                likes: likesCount || 0,
                comments: commentsCount || 0,
                shares: post.shares || 0,
              },
              userLiked,
              userBookmarked,
            };
          })
        );
        setPosts(postsWithStats);
      } catch (err) {
        setPosts([]);
        console.error("ForYou feed error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeTab, user?.id, key]);
  
  const sportTabs = [
    { id: "for-you", label: t("nav.forYou") },
    { id: "basketball", label: "Basketball" },
    { id: "football", label: "Football" },
    { id: "soccer", label: "Soccer" },
    { id: "baseball", label: "Baseball" }
  ];
  
  const handleRefresh = () => {
    setRefreshing(true);
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Feed refreshed");
    }, 1000);
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSideMenuOpen(true)}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="SportsLinked Logo" 
                className="h-12 object-contain" 
                style={{ width: '100%', maxWidth: '220px' }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              className="dark:text-white dark:hover:bg-gray-800"
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/search")}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/settings")}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="container px-4 overflow-x-auto pb-2 scrollbar-none">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent p-0 h-10">
              {sportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:border-b-2 dark:text-gray-300 dark:data-[state=active]:text-white ${
                    isAthlete 
                      ? "data-[state=active]:text-athlete data-[state=active]:border-athlete" 
                      : "data-[state=active]:text-scout data-[state=active]:border-scout"
                  }`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts found.</div>
        ) : (
          <div
            ref={containerRef}
            className="w-full max-w-md mx-auto overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch", maxHeight: '100vh', minHeight: '100vh' }}
          >
            {posts.map((post, idx) => (
              <section
                key={post.id}
                className="w-full flex flex-col items-center justify-start bg-white dark:bg-black"
                style={{ margin: 0, padding: 0 }}
              >
                <ContentFeedCard
                  id={post.id}
                  user={post.user}
                  timestamp={new Date(post.created_at)}
                  content={post.content}
                  stats={post.stats}
                  userLiked={post.userLiked}
                  userBookmarked={post.userBookmarked}
                  hashtags={Array.isArray(post.hashtags) && post.hashtags.length > 0 ? post.hashtags : (post.content?.text?.match(/#(\w+)/g) || []).map(tag => tag.slice(1))}
                />
              </section>
            ))}
          </div>
        )}
      </main>

      {isAthlete && <UploadButton />}
      
      <BottomNavigation />
    </div>
  );
};

export default ForYou;
