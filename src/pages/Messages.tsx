
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ConversationView from "@/components/ConversationView";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isImage?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Coach Wilson",
    avatar: "",
    lastMessage: "I watched your highlight reel. Can we schedule a call?",
    time: "2h ago",
    unread: true,
    messages: [
      {
        id: "msg1",
        senderId: "coach-wilson",
        text: "Hey there! I've been looking at your recent games.",
        timestamp: new Date(Date.now() - 3600000 * 48)
      },
      {
        id: "msg2",
        senderId: "current-user",
        text: "Thank you for reaching out! I'm glad you liked what you saw.",
        timestamp: new Date(Date.now() - 3600000 * 24)
      },
      {
        id: "msg3",
        senderId: "coach-wilson",
        text: "I watched your highlight reel. Can we schedule a call?",
        timestamp: new Date(Date.now() - 3600000 * 2)
      }
    ]
  },
  {
    id: "2",
    name: "Alex Thompson",
    avatar: "",
    lastMessage: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
    time: "1d ago",
    unread: false,
    messages: [
      {
        id: "msg1",
        senderId: "alex-thompson",
        text: "Hey, that was an amazing game yesterday!",
        timestamp: new Date(Date.now() - 3600000 * 26)
      },
      {
        id: "msg2",
        senderId: "current-user",
        text: "Thanks Alex! It was a tough one but we pulled through.",
        timestamp: new Date(Date.now() - 3600000 * 25)
      },
      {
        id: "msg3",
        senderId: "alex-thompson",
        text: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
        timestamp: new Date(Date.now() - 3600000 * 24)
      }
    ]
  },
  {
    id: "3",
    name: "Michigan State",
    avatar: "",
    lastMessage: "We'd like to invite you for a campus visit next month.",
    time: "2d ago",
    unread: false,
    messages: [
      {
        id: "msg1",
        senderId: "michigan-state",
        text: "Hello, we've been following your career with interest.",
        timestamp: new Date(Date.now() - 3600000 * 72)
      },
      {
        id: "msg2",
        senderId: "michigan-state",
        text: "Our coaching staff is very impressed with your skills.",
        timestamp: new Date(Date.now() - 3600000 * 70)
      },
      {
        id: "msg3",
        senderId: "current-user",
        text: "Thank you! I'm honored to hear that.",
        timestamp: new Date(Date.now() - 3600000 * 65)
      },
      {
        id: "msg4",
        senderId: "michigan-state",
        text: "We'd like to invite you for a campus visit next month.",
        timestamp: new Date(Date.now() - 3600000 * 48)
      }
    ]
  },
  {
    id: "4",
    name: "Sarah Williams",
    avatar: "",
    lastMessage: "Thanks for connecting! Looking forward to seeing more of your games.",
    time: "1w ago",
    unread: false,
    messages: [
      {
        id: "msg1",
        senderId: "sarah-williams",
        text: "Hi there, I'm a talent scout for college basketball.",
        timestamp: new Date(Date.now() - 3600000 * 168)
      },
      {
        id: "msg2",
        senderId: "current-user",
        text: "Hi Sarah, nice to meet you!",
        timestamp: new Date(Date.now() - 3600000 * 167)
      },
      {
        id: "msg3",
        senderId: "sarah-williams",
        text: "Thanks for connecting! Looking forward to seeing more of your games.",
        timestamp: new Date(Date.now() - 3600000 * 166)
      }
    ]
  }
];

const Messages = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Select a conversation to view
  const handleSelectConversation = (conversation: Conversation) => {
    // Mark as read
    const updatedConversations = conversations.map(c => 
      c.id === conversation.id ? { ...c, unread: false } : c
    );
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {selectedConversation ? (
        <ConversationView 
          conversation={selectedConversation} 
          onClose={() => setSelectedConversation(null)}
        />
      ) : (
        <>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="container px-4 h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold dark:text-white">{t("messages.title")}</h1>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="container px-4 py-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("messages.searchPlaceholder")} 
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Conversations list */}
            <div className="space-y-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((convo) => (
                  <Card 
                    key={convo.id}
                    className="flex items-center p-3 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSelectConversation(convo)}
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
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {convo.time}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        convo.unread 
                          ? "font-medium dark:text-gray-200" 
                          : "text-muted-foreground dark:text-gray-400"
                      }`}>
                        {convo.lastMessage}
                      </p>
                    </div>
                    
                    {convo.unread && (
                      <div className={`h-2 w-2 rounded-full ml-2 ${isAthlete ? "bg-athlete" : "bg-scout"}`} />
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground dark:text-gray-400">
                    {t("messages.noResults")}
                  </p>
                </div>
              )}
            </div>
            
            {conversations.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {t("messages.emptyState")}
                </p>
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
        </>
      )}
    </div>
  );
};

export default Messages;
