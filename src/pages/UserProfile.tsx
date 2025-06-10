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
  winPercentage?: number;
  scoutType?: string;
  scoutTeam?: string;
  scoutSport?: string;
  scoutYearsExperience?: number;
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
          winPercentage: profile.win_percentage,
          scoutType: profile.scout_type,
          scoutTeam: profile.scout_team,
          scoutSport: profile.scout_sport,
          scoutYearsExperience: profile.scout_years_experience
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 pt-8 pb-4 flex flex-col border-b bg-white dark:bg-gray-900 relative">
        <div className="flex items-center w-full justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData?.profilePic} />
                  <AvatarFallback>{profileData?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{profileData?.name}</h1>
                  {profileData?.role === "scout" && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {profileData.scoutType === "independent" ? "Independent Scout" : `Scout for ${profileData.scoutTeam}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {profileData.scoutSport} • {profileData.scoutYearsExperience} years of experience
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileData?.followers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{profileData?.following}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Following</p>
                </div>
              </div>

              {profileData?.bio && (
                <p className="text-gray-600 dark:text-gray-300 mb-6">{profileData.bio}</p>
              )}

              {profileData?.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <ProfilePostGrid userId={userId} />
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {profileData?.role === "scout" && (
                      <>
                        <div>
                          <h3 className="font-semibold mb-1">Scout Type</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {profileData.scoutType === "independent" ? "Independent Scout" : `Team Scout (${profileData.scoutTeam})`}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Sport</h3>
                          <p className="text-gray-600 dark:text-gray-300">{profileData.scoutSport}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Experience</h3>
                          <p className="text-gray-600 dark:text-gray-300">{profileData.scoutYearsExperience} years</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default UserProfile;
