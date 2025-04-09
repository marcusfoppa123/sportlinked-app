
import React from "react";
import { User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus } from "lucide-react";

interface ProfileCardProps {
  user: Partial<User>;
  isFullProfile?: boolean;
  sport?: string;
  position?: string;
  stats?: Record<string, string | number>;
}

const ProfileCard = ({ 
  user, 
  isFullProfile = false,
  sport = "Basketball",
  position = "Point Guard",
  stats = { 
    "PPG": "22.5", 
    "APG": "7.2", 
    "RPG": "4.1" 
  }
}: ProfileCardProps) => {
  const isAthlete = user.role === "athlete";
  
  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className={`overflow-hidden ${isAthlete ? "athlete-card" : "scout-card"}`}>
      <div 
        className={`h-24 w-full ${isAthlete ? "bg-athlete" : "bg-scout"}`}
      />
      <CardHeader className="relative pt-0 pb-4">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback className={`text-xl ${isAthlete ? "bg-blue-100" : "bg-green-100"}`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold">{user.name || "User Name"}</h3>
          <div className="flex justify-center mt-1 gap-2">
            <Badge variant="outline" className={isAthlete ? "athlete-badge" : "scout-badge"}>
              {isAthlete ? "Athlete" : "Scout"}
            </Badge>
            {isAthlete && (
              <Badge variant="outline" className="bg-gray-100">
                {sport} • {position}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isAthlete && isFullProfile && (
        <CardContent className="pb-4">
          <div className="grid grid-cols-3 gap-2 mt-2">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">{key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">About</h4>
            <p className="text-sm text-gray-600">
              Point guard with 5 years of college experience. Looking for professional opportunities.
              Specializing in ball handling and court vision.
            </p>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-center gap-2 pt-2">
        {isAthlete ? (
          // Actions for athlete profiles
          <>
            <Button variant="outline" size="sm" className="flex-1" disabled={!isFullProfile}>
              <MessageSquare className="mr-1 h-4 w-4" />
              Message
            </Button>
            <Button 
              size="sm" 
              className={`flex-1 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
            >
              <UserPlus className="mr-1 h-4 w-4" />
              {isFullProfile ? "Connect" : "View Profile"}
            </Button>
          </>
        ) : (
          // Actions for scout profiles
          <Button 
            size="sm" 
            className="flex-1 bg-scout hover:bg-scout/90"
          >
            <MessageSquare className="mr-1 h-4 w-4" />
            Contact
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
