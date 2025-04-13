
import React from "react";
import { UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

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
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const isAthlete = user.role === "athlete";
  
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
      
      <CardFooter className="flex justify-center pb-4">
        <Button 
          onClick={onViewProfile}
          className={isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
