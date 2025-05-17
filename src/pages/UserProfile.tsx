import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share2, UserPlus, UserMinus } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ProfilePostGrid from "@/components/ProfilePostGrid";
import { supabase, checkIfUserIsFollowing, followUser, unfollowUser, checkMutualFollow, createConversationIfNotExists } from "@/integrations/supabase/client";
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
  ppg?: number;
  apg?: number;
  rpg?: number;
  games?: number;
  winPercentage?: number;
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
      // Fetch profile data for the viewed user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (profileError) throw profileError;
      if (profile) {
        setProfileData({
          id: profile.id,
          name: profile.full_name || profile.username || 'Unknown User',
          role: profile.role,
          profilePic: profile.avatar_url,
          bio: profile.bio,
          location: profile.location,
          sport: profile.sport,
          position: profile.position,
          experience: profile.experience,
          followers: profile.followers || 0,
          following: profile.following || 0,
          
          // Add type assertion for these properties that might not be in the type definition
          ppg: (profile as any).ppg,
          apg: (profile as any).apg,
          rpg: (profile as any).rpg,
          games: (profile as any).games,
          winPercentage: (profile as any).win_percentage
        });
      }
      
      // Check if current user is following this profile
      if (currentUser?.id) {
        const following = await checkIfUserIsFollowing(currentUser.id, userId);
        setIsFollowing(following);
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
        const result = await unfollowUser(currentUser.id, userId);
        
        if (!result.success) {
          throw new Error(result.error?.message || "Failed to unfollow user");
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
        const result = await followUser(currentUser.id, userId);
        
        if (!result.success) {
          throw new Error(result.error?.message || "Failed to follow user");
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

        // --- NEW: Check for mutual follow and create conversation if needed ---
        if (await checkMutualFollow(currentUser.id, userId)) {
          await createConversationIfNotExists(currentUser.id, userId);
        }
        // --- END NEW ---
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

  return (
    <div className="min-h-screen pb-16 bg-white dark:bg-gray-900">
      <div className="w-full px-4 pt-8 pb-4 flex flex-col border-b bg-white dark:bg-gray-900 relative">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-2 border-gray-200">
              <AvatarImage src={profileData.profilePic} />
              <AvatarFallback className="text-2xl bg-gray-100">
                {getInitials(profileData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold mr-2">{profileData.name}</span>
              </div>
              {currentUser?.id !== userId && (
                <div className="flex mt-2 space-x-2">
                  <Button 
                    className={`px-4 py-1 rounded-full text-sm ${
                      isFollowing 
                        ? "bg-gray-200 text-black hover:bg-gray-300" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? "Loading..." : isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-around mt-6 mb-2">
          <div className="text-center">
            <span className="font-bold text-lg">{profileData.followers}</span>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{profileData.following}</span>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="font-semibold break-words whitespace-pre-line">{profileData.bio}</div>
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
            {userId && <ProfilePostGrid userId={userId} />}
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {isAthlete ? (
              <div className="grid grid-cols-2 gap-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 dark:text-white">Season Averages</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-300">PPG</p>
                        <p className="font-semibold dark:text-white">{profileData.ppg || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-300">APG</p>
                        <p className="font-semibold dark:text-white">{profileData.apg || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-300">RPG</p>
                        <p className="font-semibold dark:text-white">{profileData.rpg || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 dark:text-white">Career Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Games</p>
                        <p className="font-semibold dark:text-white">{profileData.games || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Win %</p>
                        <p className="font-semibold dark:text-white">{profileData.winPercentage || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Stats are only available for athletes</p>
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
                    <span className="dark:text-white">{profileData.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <span className="dark:text-white">{profileData.location || "Not specified"}</span>
                  </div>
                  {isAthlete && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Sport</span>
                        <span className="dark:text-white">{profileData.sport || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Position</span>
                        <span className="dark:text-white">{profileData.position || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Experience</span>
                        <span className="dark:text-white">{profileData.experience || "Not specified"}</span>
                      </div>
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
