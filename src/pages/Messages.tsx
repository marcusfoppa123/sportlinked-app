
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

// Mock data for conversations - exported so it can be used in Conversation.tsx
export const mockConversations = [
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter conversations based on search query
  const filteredConversations = mockConversations.filter(
    convo => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleConversationClick = (id: string) => {
    navigate(`/conversation/${id}`);
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">{t("nav.messages")}</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="dark:text-white dark:hover:bg-gray-800"
          >
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
            placeholder={t("messages.searchMessages")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        {/* No results message */}
        {filteredConversations.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            {t("messages.noResults")}
          </div>
        )}
        
        {/* Conversations list */}
        <div className="space-y-2">
          {filteredConversations.map((convo) => (
            <Card 
              key={convo.id}
              className="flex items-center p-3 cursor-pointer hover:bg-muted transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              onClick={() => handleConversationClick(convo.id)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={convo.avatar} />
                <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                  {convo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-medium truncate dark:text-white ${convo.unread ? "font-semibold" : ""}`}>
                    {convo.name}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2 dark:text-gray-400">
                    {convo.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${convo.unread ? "font-medium dark:text-gray-200" : "text-gray-500 dark:text-gray-400"}`}>
                  {convo.lastMessage}
                </p>
              </div>
              
              {convo.unread && (
                <div className={`h-2 w-2 rounded-full ml-2 ${isAthlete ? "bg-athlete" : "bg-scout"}`} />
              )}
            </Card>
          ))}
        </div>
        
        {filteredConversations.length > 0 && searchQuery === "" && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("messages.connectWithAthletes")}</p>
            <Button 
              className={`mt-2 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
            >
              {t("messages.findConnections")}
            </Button>
          </div>
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Messages;
