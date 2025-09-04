import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share2, UserPlus, UserMinus, MapPin, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ProfilePostGrid from "@/components/ProfilePostGrid";
import { supabase } from "@/integrations/supabase/client";
import { checkIfFollowing, followUser, unfollowUser, checkMutualFollow } from "@/integrations/supabase/modules/followers";
import { createConversationIfNotExists } from "@/integrations/supabase/modules/conversations";
import { toast } from "@/components/ui/use-toast";

interface UserProfileData {
  id: string;
  name: string;
  role: string;
  profilePic?: string;
  bio?: string;
  location?: string;
  sport?: string;
  position?: string;
  experience?: string;
  followers: number;
  following: number;
  winPercentage?: number;
  scoutType?: string;
  scoutTeam?: string;
  scoutSport?: string;
  scoutYearsExperience?: number;
  ppg?: number;
  apg?: number;
  rpg?: number;
  games?: number;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, updateUserProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfileData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Fetch profile data for the viewed user (excluding sensitive data for non-owners)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, role, bio, location, sport, position, experience, team_size, founded_year, home_venue, website, followers, following, connections, posts, offers, ppg, apg, rpg, games, win_percentage, scout_type, scout_team, scout_sport, scout_years_experience, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();
      if (profileError) throw profileError;
      if (profile) {
        const profileDataCast = profile as any;
        setProfileData({
          id: profileDataCast.id,
          name: profileDataCast.full_name || profileDataCast.username || 'Unknown User',
          role: profileDataCast.role,
          profilePic: profileDataCast.avatar_url,
          bio: profileDataCast.bio,
          location: profileDataCast.location,
          sport: profileDataCast.sport,
          position: profileDataCast.position,
          experience: profileDataCast.experience,
          followers: profileDataCast.followers || 0,
          following: profileDataCast.following || 0,
          winPercentage: profileDataCast.win_percentage,
          scoutType: profileDataCast.scout_type,
          scoutTeam: profileDataCast.scout_team,
          scoutSport: profileDataCast.scout_sport,
          scoutYearsExperience: profileDataCast.scout_years_experience,
          ppg: profileDataCast.ppg,
          apg: profileDataCast.apg,
          rpg: profileDataCast.rpg,
          games: profileDataCast.games
        });
      }
      
      // Check if current user is following this profile
      if (currentUser?.id && userId) {
        const { data: following } = await checkIfFollowing(currentUser.id, userId);
        setIsFollowing(following || false);
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        description: 'Failed to load profile',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId, currentUser?.id]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast({
        description: "You must be logged in to follow users",
        variant: "destructive"
      });
      return;
    }
    
    if (!userId) {
      toast({
        description: "Invalid user ID",
        variant: "destructive"
      });
      return;
    }
    
    setFollowLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow user
        const { data, error } = await unfollowUser(currentUser.id, userId);
        
        if (error) {
          throw new Error(error.message || "Failed to unfollow user");
        }
        
        setIsFollowing(false);
        toast({
          description: "Unfollowed successfully",
          variant: "success"
        });
        
        // Update the UI with the new follower count
        if (profileData) {
          setProfileData({
            ...profileData,
            followers: Math.max(0, profileData.followers - 1)
          });
        }
        
        // Refresh current user data to update their following count
        await refreshUserProfile();
      } else {
        // Follow user
        const { data, error } = await followUser(currentUser.id, userId);
        
        if (error) {
          throw new Error(error.message || "Failed to follow user");
        }
        
        setIsFollowing(true);
        toast({
          description: "Followed successfully",
          variant: "success"
        });
        
        // Update the UI with the new follower count
        if (profileData) {
          setProfileData({
            ...profileData,
            followers: profileData.followers + 1
          });
        }
        
        // Refresh current user data to update their following count
        await refreshUserProfile();

        // Check for mutual follow and create conversation if needed
        const { data: isMutualFollow } = await checkMutualFollow(currentUser.id, userId);
        if (isMutualFollow) {
          await createConversationIfNotExists(currentUser.id, userId);
        }
      }
    } catch (error) {
      console.error("Error in follow/unfollow operation:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : 'Failed to follow/unfollow user. Please try again.';
      
      toast({
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profileData) {
    return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;
  }

  const isAthlete = profileData.role === "athlete";
  const isScout = profileData.role === "scout";

  return (
    <div className="min-h-screen pb-16 bg-white dark:bg-gray-900 relative">
      <div className="w-full px-4 pt-8 pb-4 flex flex-col border-b bg-white dark:bg-gray-900 relative">
        <div className="flex items-center w-full justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            {currentUser?.id !== userId && (
              <Button 
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-4 py-1 rounded-full text-sm ${
                  isFollowing 
                    ? "bg-gray-200 text-black hover:bg-gray-300" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center w-full">
          <Avatar className="h-20 w-20 border-2 border-gray-200 overflow-hidden">
            <AvatarImage src={profileData?.profilePic} />
            <AvatarFallback className="text-2xl bg-gray-100">
              {getInitials(profileData?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex flex-col">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">{profileData?.name}</span>
              <Badge className="athlete-badge text-xs px-2 py-0.5">{profileData?.role}</Badge>
            </div>
            {isScout && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {profileData.scoutType === "independent"
                    ? "Independent Scout"
                    : profileData.scoutType === "team" && profileData.scoutTeam
                    ? `Scout for ${profileData.scoutTeam}`
                    : "Scout"}
                </p>
                {profileData.scoutSport && profileData.scoutYearsExperience != null && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {profileData.scoutSport} • {profileData.scoutYearsExperience} {profileData.scoutYearsExperience === 1 ? 'year' : 'years'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-around mt-6 mb-2">
          <div className="text-center">
            <span className="font-bold text-lg">0</span>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/user/${userId}/followers`)}>
            <span className="font-bold text-lg">{profileData?.followers}</span>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/user/${userId}/following`)}>
            <span className="font-bold text-lg">{profileData?.following}</span>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
        
        {profileData?.bio && (
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="font-semibold break-words whitespace-pre-line">{profileData.bio}</div>
          </div>
        )}
        
        {profileData?.location && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
            <MapPin className="h-4 w-4" />
            <span>{profileData.location}</span>
          </div>
        )}
      </div>
      
      <main className="px-0 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 dark:bg-gray-800">
            <TabsTrigger value="posts" className="dark:text-gray-300 dark:data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="stats" className="dark:text-gray-300 dark:data-[state=active]:text-white">Stats</TabsTrigger>
            <TabsTrigger value="about" className="dark:text-gray-300 dark:data-[state=active]:text-white">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <ProfilePostGrid userId={userId} />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {isAthlete ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Season Stats</p>
                    <div className="grid grid-cols-3 gap-4">
                      {profileData.ppg !== undefined && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.ppg}</p>
                          <p className="text-xs text-gray-500">PPG</p>
                        </div>
                      )}
                      {profileData.apg !== undefined && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profileData.apg}</p>
                          <p className="text-xs text-gray-500">APG</p>
                        </div>
                      )}
                      {profileData.rpg !== undefined && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileData.rpg}</p>
                          <p className="text-xs text-gray-500">RPG</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {(profileData.games !== undefined || profileData.winPercentage !== undefined) && (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Career Stats</p>
                      <div className="grid grid-cols-2 gap-4">
                        {profileData.games !== undefined && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profileData.games}</p>
                            <p className="text-xs text-gray-500">Games</p>
                          </div>
                        )}
                        {profileData.winPercentage !== undefined && (
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{profileData.winPercentage}%</p>
                            <p className="text-xs text-gray-500">Win %</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {isScout ? "Scout-specific stats are private" : "Stats are only available for athletes"}
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
                    <span className="dark:text-white">{profileData?.name}</span>
                  </div>
                  {profileData?.location && (
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500 dark:text-gray-400">Location</span>
                      <span className="dark:text-white">{profileData.location}</span>
                    </div>
                  )}
                  {isAthlete && (
                    <>
                      {profileData?.sport && (
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500 dark:text-gray-400">Sport</span>
                          <span className="dark:text-white">{profileData.sport}</span>
                        </div>
                      )}
                      {profileData?.position && (
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500 dark:text-gray-400">Position</span>
                          <span className="dark:text-white">{profileData.position}</span>
                        </div>
                      )}
                      {profileData?.experience && (
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500 dark:text-gray-400">Experience</span>
                          <span className="dark:text-white">{profileData.experience}</span>
                        </div>
                      )}
                    </>
                  )}
                  {isScout && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Scout Type</span>
                        <span className="dark:text-white capitalize">
                          {profileData.scoutType === "independent"
                            ? "Independent"
                            : profileData.scoutType === "team" && profileData.scoutTeam
                            ? `Team (${profileData.scoutTeam})`
                            : "N/A"}
                        </span>
                      </div>
                      {profileData.scoutSport && (
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500 dark:text-gray-400">Sport</span>
                          <span className="dark:text-white capitalize">{profileData.scoutSport}</span>
                        </div>
                      )}
                      {profileData.scoutYearsExperience !== undefined && (
                        <div className="grid grid-cols-2">
                          <span className="text-gray-500 dark:text-gray-400">Experience</span>
                          <span className="dark:text-white">{profileData.scoutYearsExperience} {profileData.scoutYearsExperience === 1 ? 'year' : 'years'}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default UserProfile;
