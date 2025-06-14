
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Share2, Plus, CheckCircle2, Trophy, Target, TrendingUp, Users, Award, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SideMenu from "@/components/SideMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import ContentFeed from "@/components/ContentFeed";
import ProfilePostGrid from "@/components/ProfilePostGrid";
import { supabase } from "@/integrations/supabase/client";

const highlightData = [
  { label: "Before/After", icon: <span className="text-xl">🛠️</span> },
  { label: "Quiz", icon: <span className="text-xl">❓</span> },
  { label: "Architecture", icon: <span className="text-xl">🏛️</span> },
];

const Profile = () => {
  const { user, updateUserProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const isScout = user?.role === "scout";
  const isMobile = useIsMobile();
  
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  
  const [stats, setStats] = useState({
    connections: user?.connections || 0,
    posts: user?.posts || 0,
    offers: isAthlete ? (user?.offers || 0) : 0
  });
  
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [statValue, setStatValue] = useState<number>(0);
  
  const [athleteStats, setAthleteStats] = useState({
    goals: user?.goals || 12,
    assists: user?.assists || 8,
    matches: user?.matches || 24,
    winPercentage: user?.winPercentage || 65,
    cleanSheets: user?.cleanSheets || 8
  });
  
  const [editingAthleteStat, setEditingAthleteStat] = useState<string | null>(null);
  const [athleteStatValue, setAthleteStatValue] = useState<number>(0);
  
  const [realPostCount, setRealPostCount] = useState<number>(0);
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Add a refresh effect that runs on component mount
  useEffect(() => {
    // Refresh user profile data from the database when component mounts
    if (user?.id) {
      refreshUserProfile();
    }
  }, [user?.id]);

  // Add additional effect to fetch accurate follower and following counts
  useEffect(() => {
    const fetchFollowerCounts = async () => {
      if (!user?.id) return;
      
      try {
        // Get accurate follower count
        const { count: followerCount, error: followerError } = await supabase
          .from('followers')
          .select('id', { count: 'exact' })
          .eq('following_id', user.id);
          
        // Get accurate following count
        const { count: followingCount, error: followingError } = await supabase
          .from('followers')
          .select('id', { count: 'exact' })
          .eq('follower_id', user.id);
          
        if (!followerError && !followingError && 
            (followerCount !== user.followers || followingCount !== user.following)) {
          // Only update if counts differ from current user data
          await updateUserProfile({
            followers: Math.max(0, followerCount || 0),
            following: Math.max(0, followingCount || 0)
          });
        }
      } catch (error) {
        console.error("Error fetching follower counts:", error);
      }
    };
    
    fetchFollowerCounts();
  }, [user?.id]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  useEffect(() => {
    const fetchPostCount = async () => {
      if (!user?.id) return;
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      setRealPostCount(count || 0);
    };
    fetchPostCount();
  }, [user?.id]);

  // Added the missing handleSettingsClick function
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // Added the missing openAthleteStatEditor function
  const openAthleteStatEditor = (stat: string, value: number) => {
    setEditingAthleteStat(stat);
    setAthleteStatValue(value);
  };

  // Added the missing saveAthleteStatChange function
  const saveAthleteStatChange = async () => {
    if (!editingAthleteStat) return;

    try {
      // Update local state
      setAthleteStats(prev => ({
        ...prev,
        [editingAthleteStat]: athleteStatValue
      }));

      // Update in database
      await updateUserProfile({
        [editingAthleteStat]: athleteStatValue
      });

      // Close the dialog
      setEditingAthleteStat(null);
    } catch (error) {
      console.error('Error updating athlete stat:', error);
    }
  };

  // Added the missing handleCreatePost function
  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <div className="min-h-screen pb-16 bg-white dark:bg-gray-900 relative">
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      <div className="w-full px-4 pt-8 pb-4 flex flex-col border-b bg-white dark:bg-gray-900 relative">
        <button className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full" onClick={handleSettingsClick}>
          <Settings className="h-5 w-5 text-gray-700" />
        </button>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-2 border-gray-200 overflow-hidden">
              <AvatarImage 
                src={user?.profilePic} 
                className="object-cover w-full h-full"
                style={{ objectFit: 'cover' }}
              />
              <AvatarFallback className="text-2xl bg-gray-100">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold mr-2">{user?.name || "User Name"}</span>
                <CheckCircle2 className="text-blue-500 h-5 w-5" />
              </div>
              {isScout && user && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.scoutType === "independent"
                      ? "Independent Scout"
                      : user.scoutType === "team" && user.scoutTeam
                      ? `Scout for ${user.scoutTeam}`
                      : "Scout"}
                  </p>
                  {user.scoutSport && user.scoutYearsExperience != null && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {user.scoutSport} • {user.scoutYearsExperience} {user.scoutYearsExperience === 1 ? 'year' : 'years'}
                    </p>
                  )}
                </div>
              )}
              <div className="flex mt-2 space-x-2">
                <Button className="bg-gray-200 text-black px-4 py-1 rounded-full text-sm" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-around mt-6 mb-2">
          <div className="text-center">
            <span className="font-bold text-lg">{realPostCount}</span>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{Math.max(0, user?.followers ?? 0)}</span>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{Math.max(0, user?.following ?? 0)}</span>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="font-semibold break-words whitespace-pre-line">{user?.bio || "The best Architecture & Design platform."}</div>
        </div>
      </div>

      <main className="px-0 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 dark:bg-gray-800">
            <TabsTrigger value="posts" className="dark:text-gray-300 dark:data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="stats" className="dark:text-gray-300 dark:data-[state=active]:text-white">Stats</TabsTrigger>
            <TabsTrigger value="about" className="dark:text-gray-300 dark:data-[state=active]:text-white">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {user?.id && <ProfilePostGrid userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {isAthlete ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-lg dark:text-white">Season Stats</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openAthleteStatEditor('goals', athleteStats.goals)}
                      >
                        <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Goals</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{athleteStats.goals}</p>
                      </div>
                      <div 
                        className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openAthleteStatEditor('assists', athleteStats.assists)}
                      >
                        <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Assists</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{athleteStats.assists}</p>
                      </div>
                      <div 
                        className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openAthleteStatEditor('cleanSheets', athleteStats.cleanSheets)}
                      >
                        <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Clean Sheets</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{athleteStats.cleanSheets}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold text-lg dark:text-white">Career Stats</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openAthleteStatEditor('matches', athleteStats.matches)}
                      >
                        <Award className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Matches</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{athleteStats.matches}</p>
                      </div>
                      <div 
                        className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                        onClick={() => openAthleteStatEditor('winPercentage', athleteStats.winPercentage)}
                      >
                        <TrendingUp className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Win %</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{athleteStats.winPercentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {isScout ? "Scout-specific stats are coming soon!" : "Stats are only available for athletes"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 dark:text-white">Personal Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="dark:text-white">{user?.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <span className="dark:text-white">{user?.location || "New York, NY"}</span>
                  </div>
                  {isAthlete && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Sport</span>
                        <span className="dark:text-white">{user?.sport || "Basketball"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Position</span>
                        <span className="dark:text-white">{user?.position || "Point Guard"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Experience</span>
                        <span className="dark:text-white">{user?.experience || "College"}</span>
                      </div>
                    </>
                  )}
                  {isScout && user && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Scout Type</span>
                        <span className="dark:text-white capitalize">
                          {user.scoutType === "independent"
                            ? "Independent"
                            : user.scoutType === "team" && user.scoutTeam
                            ? `Team (${user.scoutTeam})`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Sport</span>
                        <span className="dark:text-white capitalize">{user.scoutSport || "N/A"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Experience</span>
                        <span className="dark:text-white">{user.scoutYearsExperience != null ? `${user.scoutYearsExperience} ${user.scoutYearsExperience === 1 ? 'year' : 'years'}` : "N/A"}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!editingAthleteStat} onOpenChange={(open) => !open && setEditingAthleteStat(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {editingAthleteStat}</DialogTitle>
            <DialogDescription>
              Update your {editingAthleteStat} statistic
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="athlete-stat-value" className="text-right">
                Value
              </Label>
              <Input
                id="athlete-stat-value"
                type="number"
                step="0.1"
                value={athleteStatValue}
                onChange={(e) => setAthleteStatValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveAthleteStatChange}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <button
        onClick={handleCreatePost}
        className="fixed bottom-20 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
        aria-label="Create Post"
      >
        <Plus className="h-7 w-7" />
      </button>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
