import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Menu, Settings, RefreshCw, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BottomNavigation from "@/components/BottomNavigation";
import ContentFeed from "@/components/ContentFeed";
import SideMenu from "@/components/SideMenu";
import AthleteFilterPanel from "@/components/AthleteFilterPanel";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/sportslinked-logo.png";
import ContentFeedCard from "@/components/ContentFeedCard";
import ProfileCard from "@/components/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { AthleteFilters, searchAthletesWithFilters, AthleteProfile } from "@/integrations/supabase/modules/athleteFilters";

const ForYou = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAthlete = user?.role === "athlete";
  const isScout = user?.role === "scout";
  const [activeTab, setActiveTab] = useState("for-you");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of ContentFeed
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [athleteFilters, setAthleteFilters] = useState<AthleteFilters>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredProfiles, setFilteredProfiles] = useState<AthleteProfile[]>([]);
  const [searchingAthletes, setSearchingAthletes] = useState(false);
  const [showFilteredResults, setShowFilteredResults] = useState(false);
  
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
          .select("id, username, full_name, avatar_url, role, bio, location, sport, position, experience, team_size, founded_year, home_venue, website, followers, following, connections, posts, offers, ppg, apg, rpg, games, win_percentage, scout_type, scout_team, scout_sport, scout_years_experience, created_at, updated_at")
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
                scoutType: profileData?.scout_type,
                scoutTeam: profileData?.scout_team,
                scoutSport: profileData?.scout_sport,
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

  const handleClearFilters = () => {
    setAthleteFilters({});
    setFilteredProfiles([]);
    setShowFilteredResults(false);
    toast.success("Filters cleared");
  };

  const handleApplyFilters = async () => {
    try {
      setSearchingAthletes(true);
      const results = await searchAthletesWithFilters(athleteFilters);
      setFilteredProfiles(results || []);
      setShowFilteredResults(true);
      setFilterSheetOpen(false);
      toast.success(`${results.length} athletes found`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to apply filters");
    } finally {
      setSearchingAthletes(false);
    }
  };

  const hasActiveFilters = Object.entries(athleteFilters).some(([key, value]) => 
    key !== 'searchQuery' && value !== undefined && value !== ''
  );

  const themeClass = user?.role === 'athlete' ? 'athlete-theme' : user?.role === 'scout' ? 'scout-theme' : user?.role === 'team' ? 'team-theme' : '';
  return (
    <div className={`min-h-screen pb-16 ${themeClass}`}>
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
            {isScout && (
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="dark:text-white dark:hover:bg-gray-800 relative"
                  >
                    <Filter className="h-5 w-5" />
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-scout rounded-full" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Athletes</SheetTitle>
                    <SheetDescription>
                      Use advanced filters to find athletes matching your criteria
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <AthleteFilterPanel
                      filters={athleteFilters}
                      onFilterChange={setAthleteFilters}
                      onClearFilters={handleClearFilters}
                      isOpen={filtersOpen}
                      onToggle={() => setFiltersOpen(!filtersOpen)}
                    />
                    <div className="mt-4 flex gap-2">
                      <Button onClick={handleApplyFilters} disabled={searchingAthletes}>
                        {searchingAthletes ? 'Searching…' : 'Apply Filters'}
                      </Button>
                      <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
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
        {isScout && showFilteredResults ? (
          <div className="w-full max-w-md mx-auto p-4">
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No athletes match your filters.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    user={{
                      id: profile.id,
                      name: profile.full_name || profile.username,
                      role: 'athlete',
                      profilePic: profile.avatar_url,
                    }}
                    sport={profile.sport}
                    position={profile.athlete_position}
                  />
                ))}
              </div>
            )}
          </div>
        ) : loading ? (
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

      <BottomNavigation />
    </div>
  );
};

export default ForYou;
