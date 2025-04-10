
import React from "react";
import { User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, Users } from "lucide-react";

interface TeamCardProps {
  name: string;
  type: string;
  location?: string;
  memberCount?: number;
  foundedYear?: number;
  isFullProfile?: boolean;
  stats?: Record<string, string | number>;
  onViewProfile?: () => void;
}

const TeamCard = ({ 
  name, 
  type,
  location = "New York, NY",
  memberCount = 22,
  foundedYear = 2015,
  isFullProfile = false,
  stats = { 
    "Wins": "15", 
    "Losses": "7", 
    "Win %": "68%" 
  },
  onViewProfile
}: TeamCardProps) => {
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="team-card overflow-hidden">
      <div className="h-24 w-full bg-team" />
      <CardHeader className="relative pt-0 pb-4">
        <div className="absolute -top-12 left-4">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="" />
            <AvatarFallback className="text-xl bg-yellow-100">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-12 ml-28 text-left">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex mt-1 gap-2">
            <Badge variant="outline" className="team-badge">
              Team
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              {type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      {isFullProfile && (
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
              {type} team based in {location}. Founded in {foundedYear} with {memberCount} active members.
            </p>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-center gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" disabled={!isFullProfile}>
          <MessageSquare className="mr-1 h-4 w-4" />
          Message
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-team hover:bg-team/90"
          onClick={onViewProfile}
        >
          <Users className="mr-1 h-4 w-4" />
          {isFullProfile ? "Join Team" : "View Team"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
