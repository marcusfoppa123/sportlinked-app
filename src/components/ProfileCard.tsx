
import React from "react";
import { User } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus } from "lucide-react";
import ProfilePictureUpload from "./ProfilePictureUpload";

interface ProfileCardProps {
  user: Partial<User>;
  isFullProfile?: boolean;
  sport?: string;
  position?: string;
  stats?: Record<string, string | number>;
  onViewProfile?: () => void;
  onProfilePicChange?: (image: string | undefined) => void;
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
  },
  onViewProfile,
  onProfilePicChange
}: ProfileCardProps) => {
  const { t } = useLanguage();
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
    <Card className={`overflow-hidden ${isAthlete ? "athlete-card" : "scout-card"} dark:bg-gray-800 dark:border-gray-700`}>
      <div 
        className={`h-24 w-full ${isAthlete ? "bg-athlete" : "bg-scout"}`}
      />
      <CardHeader className="relative pt-0 pb-4">
        <div className="absolute -top-12 left-4">
          {onProfilePicChange ? (
            <ProfilePictureUpload
              profilePic={user.profilePic}
              name={user.name}
              role={user.role}
              onImageChange={onProfilePicChange}
            />
          ) : (
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback className={`text-xl ${isAthlete ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="mt-12 ml-28 text-left">
          <h3 className="text-xl font-semibold dark:text-white">{user.name || "User Name"}</h3>
          <div className="flex mt-1 gap-2">
            <Badge variant="outline" className={isAthlete ? "athlete-badge" : "scout-badge"}>
              {isAthlete ? t("auth.athlete") : t("auth.scout")}
            </Badge>
            {isAthlete && (
              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
              <div key={key} className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                <p className="font-semibold dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 dark:text-gray-200">{t("profile.about")}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
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
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" 
              disabled={!isFullProfile}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              {t("content.comment")}
            </Button>
            <Button 
              size="sm" 
              className={`flex-1 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"} text-white`}
              onClick={onViewProfile}
            >
              <UserPlus className="mr-1 h-4 w-4" />
              {isFullProfile ? t("profile.connect") : t("profile.viewProfile")}
            </Button>
          </>
        ) : (
          // Actions for scout profiles
          <Button 
            size="sm" 
            className="flex-1 bg-scout hover:bg-scout/90 text-white"
          >
            <MessageSquare className="mr-1 h-4 w-4" />
            {t("profile.contact")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
