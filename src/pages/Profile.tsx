import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Share2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import UploadButton from "@/components/UploadButton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SideMenu from "@/components/SideMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import ContentFeed from "@/components/ContentFeed";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const isMobile = useIsMobile();
  
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  
  const [stats, setStats] = useState({
    connections: user?.connections || 450,
    posts: user?.posts || 32,
    offers: isAthlete ? (user?.offers || 15) : 0
  });
  
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [statValue, setStatValue] = useState<number>(0);
  
  const [athleteStats, setAthleteStats] = useState({
    ppg: user?.ppg || 18.7,
    apg: user?.apg || 7.2,
    rpg: user?.rpg || 4.1,
    games: user?.games || 128,
    winPercentage: user?.winPercentage || 58
  });
  
  const [editingAthleteStat, setEditingAthleteStat] = useState<string | null>(null);
  const [athleteStatValue, setAthleteStatValue] = useState<number>(0);
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleEditProfile = () => {
    navigate("/edit-profile");
  };
  
  const handleSettingsClick = () => {
    navigate("/settings");
  };
  
  const handleCreatePost = () => {
    navigate("/create-post");
  };
  
  const openStatEditor = (stat: string, value: number) => {
    setEditingStat(stat);
    setStatValue(value);
  };
  
  const saveStatChange = () => {
    if (editingStat) {
      const newStats = { ...stats, [editingStat]: statValue };
      setStats(newStats);
      
      if (updateUserProfile) {
        updateUserProfile({ [editingStat]: statValue });
      }
      
      setEditingStat(null);
    }
  };
  
  const openAthleteStatEditor = (stat: string, value: number) => {
    setEditingAthleteStat(stat);
    setAthleteStatValue(value);
  };
  
  const saveAthleteStatChange = () => {
    if (editingAthleteStat) {
      const newStats = { ...athleteStats, [editingAthleteStat]: athleteStatValue };
      setAthleteStats(newStats);
      
      if (updateUserProfile) {
        updateUserProfile({ [editingAthleteStat]: athleteStatValue });
      }
      
      setEditingAthleteStat(null);
    }
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900`}>
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      <header className="relative">
        <div 
          className={`h-40 w-full`}
          style={{ backgroundColor: user?.profileBgColor || (isAthlete ? "#1D9BF0" : "#4CAF50") }}
        />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 text-white"
            onClick={handleSettingsClick}
          >
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
                className="ml-auto bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                onClick={handleEditProfile}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <h1 className="text-2xl font-bold dark:text-white">{user?.name || "User Name"}</h1>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className={`${isAthlete ? "athlete-badge" : "scout-badge"} dark:bg-gray-800 dark:text-white`}>
                {isAthlete ? "Athlete" : "Scout"}
              </Badge>
              {isAthlete && (
                <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-800 dark:text-white">
                  {user?.sport || "Basketball"} • {user?.position || "Point Guard"}
                </Badge>
              )}
            </div>
            
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              {user?.bio || (isAthlete 
                ? "Point guard with 5 years of college experience. Looking for professional opportunities."
                : "Basketball scout for the Michigan Wolverines. Searching for talented guards and forwards.")}
            </p>
            
            <div className="flex gap-4 mt-4 text-sm dark:text-gray-300">
              <div className="cursor-pointer" onClick={() => openStatEditor('connections', stats.connections)}>
                <span className="font-semibold">{stats.connections}</span> Connections
              </div>
              <div className="cursor-pointer" onClick={() => openStatEditor('posts', stats.posts)}>
                <span className="font-semibold">{stats.posts}</span> Posts
              </div>
              {isAthlete && (
                <div className="cursor-pointer" onClick={() => openStatEditor('offers', stats.offers)}>
                  <span className="font-semibold">{stats.offers}</span> Offers
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 dark:bg-gray-800">
            <TabsTrigger value="posts" className="dark:text-gray-300 dark:data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="stats" className="dark:text-gray-300 dark:data-[state=active]:text-white">Stats</TabsTrigger>
            <TabsTrigger value="about" className="dark:text-gray-300 dark:data-[state=active]:text-white">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {isAthlete && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Share your highlights and achievements with scouts!
                  </p>
                  <Button 
                    className={`mt-2 w-full ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
                    onClick={() => navigate("/create-post")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <ContentFeed 
              userId={user?.id} 
              showAllPosts={false}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            {isAthlete ? (
              <div className="grid grid-cols-2 gap-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 dark:text-white">Season Averages</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div 
                        className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700 cursor-pointer" 
                        onClick={() => openAthleteStatEditor('ppg', athleteStats.ppg)}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-300">PPG</p>
                        <p className="font-semibold dark:text-white">{athleteStats.ppg}</p>
                      </div>
                      <div 
                        className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700 cursor-pointer"
                        onClick={() => openAthleteStatEditor('apg', athleteStats.apg)}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-300">APG</p>
                        <p className="font-semibold dark:text-white">{athleteStats.apg}</p>
                      </div>
                      <div 
                        className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700 cursor-pointer"
                        onClick={() => openAthleteStatEditor('rpg', athleteStats.rpg)}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-300">RPG</p>
                        <p className="font-semibold dark:text-white">{athleteStats.rpg}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 dark:text-white">Career Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700 cursor-pointer"
                        onClick={() => openAthleteStatEditor('games', athleteStats.games)}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-300">Games</p>
                        <p className="font-semibold dark:text-white">{athleteStats.games}</p>
                      </div>
                      <div 
                        className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700 cursor-pointer"
                        onClick={() => openAthleteStatEditor('winPercentage', athleteStats.winPercentage)}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-300">Win %</p>
                        <p className="font-semibold dark:text-white">{athleteStats.winPercentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Stats are only available for athletes</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 dark:text-white">Personal Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500 dark:text-gray-400">Name</span>
                    <span className="dark:text-white">{user?.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <span className="dark:text-white">{user?.location || "New York, NY"}</span>
                  </div>
                  {isAthlete && (
                    <>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Sport</span>
                        <span className="dark:text-white">{user?.sport || "Basketball"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Position</span>
                        <span className="dark:text-white">{user?.position || "Point Guard"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-gray-500 dark:text-gray-400">Experience</span>
                        <span className="dark:text-white">{user?.experience || "College"}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!editingStat} onOpenChange={(open) => !open && setEditingStat(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {editingStat}</DialogTitle>
            <DialogDescription>
              Update your {editingStat} count
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stat-value" className="text-right">
                Value
              </Label>
              <Input
                id="stat-value"
                type="number"
                value={statValue}
                onChange={(e) => setStatValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveStatChange}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAthleteStat} onOpenChange={(open) => !open && setEditingAthleteStat(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {editingAthleteStat}</DialogTitle>
            <DialogDescription>
              Update your {editingAthleteStat} statistic
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="athlete-stat-value" className="text-right">
                Value
              </Label>
              <Input
                id="athlete-stat-value"
                type="number"
                step="0.1"
                value={athleteStatValue}
                onChange={(e) => setAthleteStatValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveAthleteStatChange}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isAthlete && <UploadButton />}
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
