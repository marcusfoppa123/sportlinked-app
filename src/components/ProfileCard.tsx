
import React, { useState, useEffect } from "react";
import { UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase, checkIfUserIsFollowing, followUser, unfollowUser } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ProfileCardProps {
  user: {
    name: string;
    role: UserRole;
    profilePic?: string;
    id: string;
  };
  sport?: string;
  position?: string;
  onViewProfile?: () => void;
  isFullProfile?: boolean;
  stats?: Record<string, string>;
}

const ProfileCard = ({ user, sport, position, onViewProfile, isFullProfile, stats }: ProfileCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user: currentUser, refreshUserProfile } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if current user is following this profile
    const checkFollowStatus = async () => {
      if (!currentUser?.id || !user.id || currentUser.id === user.id) {
        return;
      }
      
      setIsLoading(true);
      try {
        const following = await checkIfUserIsFollowing(currentUser.id, user.id);
        setIsFollowing(following);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkFollowStatus();
  }, [currentUser?.id, user.id]);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const isAthlete = user.role === "athlete";
  
  const handleConnect = async () => {
    if (!currentUser) {
      toast({
        description: "You must be logged in to follow users",
        variant: "destructive"
      });
      return;
    }
    
    if (currentUser.id === user.id) {
      toast({
        description: "You cannot follow yourself",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        // Unfollow user
        const result = await unfollowUser(currentUser.id, user.id);
          
        if (!result.success) {
          throw result.error;
        }
        
        setIsFollowing(false);
        toast({
          description: `Unfollowed ${user.name}`,
          variant: "default"
        });
      } else {
        // Follow user
        const result = await followUser(currentUser.id, user.id);
          
        if (!result.success) {
          throw result.error;
        }
        
        setIsFollowing(true);
        toast({
          description: `Started following ${user.name}`,
          variant: "default"
        });
      }
      
      // Refresh user profile to update follower/following counts
      await refreshUserProfile();
      
    } catch (error: any) {
      console.error('Error updating follow status:', error);
      toast({
        description: error.message || 'Failed to update follow status',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMessage = () => {
    // Navigate to messages page and open a conversation with this user
    navigate("/messages");
    toast({
      description: `Started conversation with ${user.name}`,
      variant: "default"
    });
  };

  const handleProfileClick = () => {
    navigate(`/user/${user.id}`);
  };
  
  return (
    <Card 
      className={`overflow-hidden border ${isAthlete ? "athlete-border" : "scout-border"} dark:bg-gray-800 dark:border-gray-700 cursor-pointer`}
      onClick={handleProfileClick}
    >
      <div className={`h-16 ${isAthlete ? "bg-athlete" : "bg-scout"}`} />
      
      <CardContent className="pt-0 -mt-10">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-gray-800">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="mt-4 font-semibold text-lg dark:text-white">{user.name}</h3>
          
          <div className="flex items-center mt-1">
            <Badge variant="outline" className={isAthlete ? "athlete-badge" : "scout-badge"}>
              {user.role}
            </Badge>
            {isAthlete && sport && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {sport}{position ? ` • ${position}` : ''}
              </span>
            )}
          </div>
          
          {isFullProfile && stats && (
            <div className="grid grid-cols-3 gap-2 w-full mt-3">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-300">{key}</p>
                  <p className="font-semibold dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center gap-2 pb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleMessage();
          }}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading || (currentUser?.id === user.id)}
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : isFollowing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
