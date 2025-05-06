import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Bell, Send, Image, Paperclip, X, ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/SportsLinked in app.png";

// Mock data for conversations
const mockConversations = [
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
        sender: "Coach Wilson",
        text: "Hey there! I watched your highlight reel from last season.",
        time: "2h ago",
        isMe: false
      },
      {
        id: "msg2",
        sender: "Coach Wilson",
        text: "I was really impressed with your three-point shooting and defensive awareness.",
        time: "2h ago",
        isMe: false
      },
      {
        id: "msg3",
        sender: "Coach Wilson",
        text: "I watched your highlight reel. Can we schedule a call?",
        time: "2h ago",
        isMe: false
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
        id: "msg4",
        sender: "Me",
        text: "Thanks for coming to the game!",
        time: "2d ago",
        isMe: true
      },
      {
        id: "msg5",
        sender: "Alex Thompson",
        text: "Of course! Wouldn't miss it.",
        time: "1d ago",
        isMe: false
      },
      {
        id: "msg6",
        sender: "Alex Thompson",
        text: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
        time: "1d ago",
        isMe: false
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
        id: "msg7",
        sender: "Michigan State",
        text: "Hello! We've been following your career and are very impressed.",
        time: "3d ago",
        isMe: false
      },
      {
        id: "msg8",
        sender: "Michigan State",
        text: "We'd like to invite you for a campus visit next month.",
        time: "2d ago",
        isMe: false
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
        id: "msg9",
        sender: "Sarah Williams",
        text: "Hi! I'm a scout for the regional league.",
        time: "1w ago",
        isMe: false
      },
      {
        id: "msg10",
        sender: "Sarah Williams",
        text: "Thanks for connecting! Looking forward to seeing more of your games.",
        time: "1w ago",
        isMe: false
      }
    ]
  }
];

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(mockConversations);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const updatedConversations = conversations.map(convo => {
      if (convo.id === activeConversation.id) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: "Me",
          text: newMessage,
          time: "Just now",
          isMe: true
        };
        
        return {
          ...convo,
          lastMessage: newMessage,
          time: "Just now",
          messages: [...convo.messages, newMsg]
        };
      }
      return convo;
    });
    
    setConversations(updatedConversations);
    setNewMessage("");
  };

  const navigateToNotifications = () => {
    navigate("/notifications");
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      {!activeConversation ? (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
          <div className="container px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="SportsLinked Logo" 
                className="h-8 w-auto mr-2"
              />
              <h1 className="text-xl font-bold dark:text-white">Messages</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={navigateToNotifications}
              >
                <Bell className="h-5 w-5 dark:text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5 dark:text-white" />
              </Button>
            </div>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
          <div className="container px-4 h-16 flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveConversation(null)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5 dark:text-white" />
            </Button>
            
            <div className="flex items-center flex-1">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={activeConversation.avatar} />
                <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                  {activeConversation.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-medium dark:text-white">{activeConversation.name}</h1>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="container px-4 py-4">
        {!activeConversation ? (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            
            {/* Conversations list */}
            <div className="space-y-2">
              {conversations.map((convo) => (
                <Card 
                  key={convo.id}
                  className="flex items-center p-3 cursor-pointer hover:bg-muted transition-colors dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => setActiveConversation(convo)}
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
                    <p className={`text-sm truncate ${convo.unread ? "font-medium dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect with athletes and scouts to start messaging</p>
              <Button 
                className={`mt-2 ${isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}`}
              >
                Find Connections
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Message thread */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {activeConversation.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isMe && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                        {activeConversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isMe 
                        ? `${isAthlete ? 'bg-athlete' : 'bg-scout'} text-white` 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <p className={`text-sm ${message.isMe ? 'text-white' : 'dark:text-white'}`}>{message.text}</p>
                    <span className={`text-xs mt-1 block ${
                      message.isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 pb-1">
              <div className="flex items-end space-x-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </div>
                
                <Textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[50px] resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={isAthlete ? "bg-athlete hover:bg-athlete/90" : "bg-scout hover:bg-scout/90"}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Messages;
