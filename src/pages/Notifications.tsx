import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import logo from "@/assets/SportsLinked in app.png";

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    type: "connection",
    user: {
      name: "Coach Wilson",
      avatar: "",
      role: "scout"
    },
    content: "accepted your connection request",
    time: "2h ago",
    isNew: true
  },
  {
    id: "2",
    type: "mention",
    user: {
      name: "Alex Thompson",
      avatar: "",
      role: "athlete"
    },
    content: "mentioned you in a comment: @username Great game!",
    time: "5h ago",
    isNew: true
  },
  {
    id: "3",
    type: "like",
    user: {
      name: "Michigan State",
      avatar: "",
      role: "scout"
    },
    content: "liked your highlight video",
    time: "1d ago",
    isNew: false
  },
  {
    id: "4",
    type: "view",
    user: {
      name: "Sarah Williams",
      avatar: "",
      role: "athlete"
    },
    content: "viewed your profile",
    time: "2d ago",
    isNew: false
  },
  {
    id: "5",
    type: "system",
    content: "Welcome to SportLinked! Complete your profile to get noticed by scouts.",
    time: "1w ago",
    isNew: false
  }
];

const Notifications = () => {
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="SportsLinked Logo" 
              className="h-8 w-auto mr-2"
            />
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-2">
            {mockNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`p-3 cursor-pointer hover:bg-muted transition-colors ${notification.isNew ? "border-l-4 border-l-primary" : ""}`}
              >
                <div className="flex items-start">
                  {"user" in notification ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback className={notification.user.role === "athlete" ? "bg-blue-100" : "bg-green-100"}>
                        {notification.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAthlete ? "bg-blue-100" : "bg-green-100"}`}>
                      <span className={`text-lg ${isAthlete ? "text-athlete" : "text-scout"}`}>SL</span>
                    </div>
                  )}
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-baseline">
                      {"user" in notification && (
                        <span className="font-medium">{notification.user.name} </span>
                      )}
                      <span className="text-gray-700">{notification.content}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {notification.isNew && (
                        <Badge variant="outline" className="ml-2 py-0 px-1.5 text-[10px]">New</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="mentions" className="space-y-2">
            {mockNotifications
              .filter(notif => "type" in notif && notif.type === "mention")
              .map((notification) => (
                <Card 
                  key={notification.id}
                  className={`p-3 cursor-pointer hover:bg-muted transition-colors ${notification.isNew ? "border-l-4 border-l-primary" : ""}`}
                >
                  <div className="flex items-start">
                    {"user" in notification && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback className={notification.user.role === "athlete" ? "bg-blue-100" : "bg-green-100"}>
                          {notification.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-baseline">
                        {"user" in notification && (
                          <span className="font-medium">{notification.user.name} </span>
                        )}
                        <span className="text-gray-700">{notification.content}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        {notification.isNew && (
                          <Badge variant="outline" className="ml-2 py-0 px-1.5 text-[10px]">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="connection" className="space-y-2">
            {mockNotifications
              .filter(notif => "type" in notif && notif.type === "connection")
              .map((notification) => (
                <Card 
                  key={notification.id}
                  className={`p-3 cursor-pointer hover:bg-muted transition-colors ${notification.isNew ? "border-l-4 border-l-primary" : ""}`}
                >
                  <div className="flex items-start">
                    {"user" in notification && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback className={notification.user.role === "athlete" ? "bg-blue-100" : "bg-green-100"}>
                          {notification.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-baseline">
                        {"user" in notification && (
                          <span className="font-medium">{notification.user.name} </span>
                        )}
                        <span className="text-gray-700">{notification.content}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        {notification.isNew && (
                          <Badge variant="outline" className="ml-2 py-0 px-1.5 text-[10px]">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
