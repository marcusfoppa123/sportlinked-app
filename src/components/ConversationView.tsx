
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, Smile, Image } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
  messages: Message[];
}

interface ConversationViewProps {
  conversation: Conversation;
  onClose: () => void;
}

const ConversationView = ({ conversation, onClose }: ConversationViewProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  
  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "current-user",
      text: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>
            {getInitials(conversation.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-3">
          <h3 className="font-medium dark:text-white">{conversation.name}</h3>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === user?.id || msg.senderId === "current-user";
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  isCurrentUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                } ${msg.isImage ? "p-1" : ""}`}
              >
                {msg.isImage ? (
                  <img 
                    src={msg.text} 
                    alt="Message attachment" 
                    className="rounded max-w-full max-h-60 object-contain"
                  />
                ) : (
                  <p className="break-words">{msg.text}</p>
                )}
                <div 
                  className={`text-xs mt-1 ${
                    isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message Input */}
      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <div className="flex-none flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
            >
              <Image className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1">
            <Input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("messages.typeMessage")}
              className="rounded-full"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full flex-none"
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon" 
            className="h-9 w-9 rounded-full flex-none"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
