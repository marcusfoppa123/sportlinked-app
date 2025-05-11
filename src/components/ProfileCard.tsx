import React, { useState, useEffect } from "react";
import { UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  useEffect(() => {
    // Check if current user is following this profile
    if (currentUser?.id && user.id) {
      checkFollowStatus();
    }
  }, [currentUser?.id, user.id]);
  
  const checkFollowStatus = async () => {
    try {
      const { data: followData, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', currentUser?.id)
        .eq('following_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking follow status:', error);
        return;
      }
      
      setIsFollowing(!!followData);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };
  
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
      toast.error("You must be logged in to follow users");
      return;
    }
    
    try {
      if (isFollowing) {
        // Unfollow user
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.name}`);
      } else {
        // Follow user
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: currentUser.id,
            following_id: user.id
          });
          
        if (error) {
          throw error;
        }
        
        setIsFollowing(true);
        toast.success(`Started following ${user.name}`);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error('Failed to update follow status');
    }
  };
  
  const handleMessage = () => {
    // Navigate to messages page and open a conversation with this user
    navigate("/messages");
    toast.success(`Started conversation with ${user.name}`);
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
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
        >
          {isFollowing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Following
            </>
          ) : isPending ? (
            "Pending"
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
