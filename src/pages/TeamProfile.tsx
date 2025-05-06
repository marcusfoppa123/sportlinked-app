import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Share2, Users, Trophy, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import logo from "@/assets/SportsLinked in app.png";

const TeamProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isTeam = user?.role === "team";
  
  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Mock team stats
  const teamStats = {
    "Wins": "22",
    "Losses": "8",
    "Win %": "73%"
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="team-theme min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Settings className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="SportsLinked Logo" 
                className="h-8 w-auto mr-2"
              />
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleEditProfile}
            className="dark:text-white dark:hover:bg-gray-800"
          >
            <Edit className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-gray-500">
                  Share team highlights and achievements!
                </p>
                <Button className="mt-2 w-full bg-team hover:bg-team/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No posts yet</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Team Members</h3>
                  <Button variant="outline" size="sm" className="text-team">
                    <Users className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100">
                          {String.fromCharCode(64 + index)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Athlete {index}</p>
                        <p className="text-xs text-gray-500">Position: Forward</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Season Performance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(teamStats).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Achievements</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Regional Champions 2023</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <Trophy className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">State Finalists 2022</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Team Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Name</span>
                    <span>{user?.name || "Team Name"}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Sport</span>
                    <span>Basketball</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Location</span>
                    <span>New York, NY</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Founded</span>
                    <span>2015</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Home Court</span>
                    <span>Brooklyn Sports Center</span>
                  </div>
                </div>
                
                <h3 className="font-medium mt-4 mb-2">Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Calendar className="h-4 w-4 text-team" />
                    <div>
                      <span className="text-sm font-medium">Next Game: vs Eagles</span>
                      <p className="text-xs text-gray-500">May 15, 2025 • 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default TeamProfile;
