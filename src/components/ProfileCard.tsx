
import React, { useState } from "react";
import { UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Check } from "lucide-react";
import { toast } from "sonner";

interface ProfileCardProps {
  user: {
    name: string;
    role: UserRole;
    profilePic?: string;
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
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const isAthlete = user.role === "athlete";
  
  const handleConnect = () => {
    if (isConnected) return;
    
    if (isPending) {
      // Cancel connection request
      setIsPending(false);
      toast.info("Connection request cancelled");
    } else {
      // Send connection request
      setIsPending(true);
      toast.success("Connection request sent!");
    }
  };
  
  const handleMessage = () => {
    // Navigate to messages page and open a conversation with this user
    navigate("/messages");
    toast.success(`Started conversation with ${user.name}`);
  };
  
  return (
    <Card className={`overflow-hidden border ${isAthlete ? "athlete-border" : "scout-border"} dark:bg-gray-800 dark:border-gray-700`}>
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
      
      <CardFooter className="flex justify-between gap-2 pb-4">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleConnect}
          className={`flex-1 ${
            isPending 
              ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" 
              : isConnected 
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                : "dark:bg-gray-700 dark:text-white"
          }`}
        >
          {isPending ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Pending
            </>
          ) : isConnected ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Connected
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </>
          )}
        </Button>
        
        <Button 
          size="sm"
          className={`flex-1 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
          onClick={handleMessage}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
