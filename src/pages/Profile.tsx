
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import UploadButton from "@/components/UploadButton";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  
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
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="relative">
        <div 
          className={`h-40 w-full ${isAthlete ? "bg-athlete" : "bg-scout"}`}
        />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-white/20 text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/20 text-white">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative px-4 -mt-16">
          <div className="flex items-end">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className={`text-3xl ${isAthlete ? "bg-blue-100" : "bg-green-100"}`}>
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 ml-4 mb-4">
              <Button 
                variant="outline" 
                className="ml-auto bg-white"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <h1 className="text-2xl font-bold">{user?.name || "User Name"}</h1>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className={isAthlete ? "athlete-badge" : "scout-badge"}>
                {isAthlete ? "Athlete" : "Scout"}
              </Badge>
              {isAthlete && (
                <Badge variant="outline" className="ml-2 bg-gray-100">
                  Basketball • Point Guard
                </Badge>
              )}
            </div>
            
            <p className="mt-3 text-gray-600">
              {isAthlete 
                ? "Point guard with 5 years of college experience. Looking for professional opportunities."
                : "Basketball scout for the Michigan Wolverines. Searching for talented guards and forwards."}
            </p>
            
            <div className="flex gap-4 mt-4 text-sm">
              <div>
                <span className="font-semibold">450</span> Connections
              </div>
              <div>
                <span className="font-semibold">32</span> Posts
              </div>
              {isAthlete && (
                <div>
                  <span className="font-semibold">15</span> Offers
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {isAthlete && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-gray-500">
                    Share your highlights and achievements with scouts!
                  </p>
                  <Button className={`mt-2 w-full ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No posts yet</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {isAthlete ? (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Season Averages</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">PPG</p>
                        <p className="font-semibold">18.7</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">APG</p>
                        <p className="font-semibold">7.2</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">RPG</p>
                        <p className="font-semibold">4.1</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Career Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">Games</p>
                        <p className="font-semibold">128</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">Win %</p>
                        <p className="font-semibold">58%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Stats are only available for athletes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Name</span>
                    <span>{user?.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Location</span>
                    <span>New York, NY</span>
                  </div>
                  {isAthlete && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500">Sport</span>
                        <span>Basketball</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500">Position</span>
                        <span>Point Guard</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500">Experience</span>
                        <span>College</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload button for athletes */}
      {isAthlete && <UploadButton />}
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
