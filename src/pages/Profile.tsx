import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings, Share2, Plus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
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
import ProfilePostGrid from "@/components/ProfilePostGrid";

const highlightData = [
  { label: "Before/After", icon: <span className="text-xl">🛠️</span> },
  { label: "Quiz", icon: <span className="text-xl">❓</span> },
  { label: "Architecture", icon: <span className="text-xl">🏛️</span> },
];

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const isMobile = useIsMobile();
  
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  
  const [stats, setStats] = useState({
    connections: user?.connections || 0,
    posts: user?.posts || 0,
    offers: isAthlete ? (user?.offers || 0) : 0
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
    // Stats are now read-only
  };
  
  const saveStatChange = () => {
    // Stats are now read-only
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
    <div className="min-h-screen pb-16 bg-white dark:bg-gray-900 relative">
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      <div className="w-full px-4 pt-8 pb-4 flex flex-col border-b bg-white dark:bg-gray-900 relative">
        <button className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full" onClick={handleSettingsClick}>
          <Settings className="h-5 w-5 text-gray-700" />
        </button>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-2 border-gray-200">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="text-2xl bg-gray-100">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold mr-2">{user?.name || "User Name"}</span>
                <CheckCircle2 className="text-blue-500 h-5 w-5" />
              </div>
              <div className="flex mt-2 space-x-2">
                <Button className="bg-gray-200 text-black px-4 py-1 rounded-full text-sm" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-around mt-6 mb-2">
          <div className="text-center">
            <span className="font-bold text-lg">{user?.posts ?? 0}</span>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{user?.followers ?? 0}</span>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <span className="font-bold text-lg">{user?.following ?? 0}</span>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="font-semibold break-words whitespace-pre-line">{user?.bio || "The best Architecture & Design platform."}</div>
        </div>
      </div>

      <main className="px-0 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 dark:bg-gray-800">
            <TabsTrigger value="posts" className="dark:text-gray-300 dark:data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="stats" className="dark:text-gray-300 dark:data-[state=active]:text-white">Stats</TabsTrigger>
            <TabsTrigger value="about" className="dark:text-gray-300 dark:data-[state=active]:text-white">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {user?.id && <ProfilePostGrid userId={user.id} />}
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

      <button
        onClick={handleCreatePost}
        className="fixed bottom-20 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center"
        aria-label="Create Post"
      >
        <Plus className="h-7 w-7" />
      </button>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
