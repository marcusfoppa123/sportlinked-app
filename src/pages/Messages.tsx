
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Coach Wilson",
    avatar: "",
    lastMessage: "I watched your highlight reel. Can we schedule a call?",
    time: "2h ago",
    unread: true
  },
  {
    id: "2",
    name: "Alex Thompson",
    avatar: "",
    lastMessage: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
    time: "1d ago",
    unread: false
  },
  {
    id: "3",
    name: "Michigan State",
    avatar: "",
    lastMessage: "We'd like to invite you for a campus visit next month.",
    time: "2d ago",
    unread: false
  },
  {
    id: "4",
    name: "Sarah Williams",
    avatar: "",
    lastMessage: "Thanks for connecting! Looking forward to seeing more of your games.",
    time: "1w ago",
    unread: false
  }
];

const Messages = () => {
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon">
            <Edit className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9"
          />
        </div>
        
        {/* Conversations list */}
        <div className="space-y-2">
          {mockConversations.map((convo) => (
            <Card 
              key={convo.id}
              className="flex items-center p-3 cursor-pointer hover:bg-muted transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={convo.avatar} />
                <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                  {convo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-medium truncate ${convo.unread ? "font-semibold" : ""}`}>
                    {convo.name}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {convo.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${convo.unread ? "font-medium" : "text-gray-500"}`}>
                  {convo.lastMessage}
                </p>
              </div>
              
              {convo.unread && (
                <div className={`h-2 w-2 rounded-full ml-2 ${isAthlete ? "bg-athlete" : "bg-scout"}`} />
              )}
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Connect with athletes and scouts to start messaging</p>
          <Button 
            className={`mt-2 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
          >
            Find Connections
          </Button>
        </div>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Messages;
