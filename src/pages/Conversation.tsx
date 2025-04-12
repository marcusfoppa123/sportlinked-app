
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Image, Send, Smile } from "lucide-react";
import { mockConversations } from "@/pages/Messages";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isImage?: boolean;
}

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAthlete = user?.role === "athlete";
  
  // Find the conversation from mock data
  const conversation = mockConversations.find(c => c.id === id);
  
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: conversation?.id || "",
      text: conversation?.lastMessage || "",
      timestamp: new Date(Date.now() - 3600000 * 24)
    }
  ]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  if (!conversation) {
    navigate("/messages");
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if ((!message.trim() && !imagePreview) || !user) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id || "current-user",
      text: imagePreview ? "" : message,
      timestamp: new Date(),
      isImage: !!imagePreview
    };
    
    if (imagePreview) {
      newMessage.text = imagePreview;
      newMessage.isImage = true;
    }
    
    setMessages([...messages, newMessage]);
    setMessage("");
    setImagePreview(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isAthlete ? "athlete-theme" : "scout-theme"} dark:bg-gray-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/messages")}
            className="mr-2 dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center flex-1 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                {getInitials(conversation.name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="font-medium dark:text-white">{conversation.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {conversation.unread ? t("messages.online") : t("messages.lastSeen")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === (user?.id || "current-user") ? "justify-end" : "justify-start"}`}
          >
            {msg.senderId !== (user?.id || "current-user") && (
              <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback className={isAthlete ? "bg-blue-100" : "bg-green-100"}>
                  {getInitials(conversation.name)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="max-w-[70%]">
              <div 
                className={`px-3 py-2 rounded-lg ${
                  msg.senderId === (user?.id || "current-user") 
                    ? `${isAthlete ? "bg-athlete text-white" : "bg-scout text-white"}`
                    : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                }`}
              >
                {msg.isImage ? (
                  <img src={msg.text} alt="Shared" className="rounded-md max-w-full" />
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
              onClick={() => setImagePreview(null)}
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleImageUpload}
            className="dark:text-white dark:hover:bg-gray-800"
          >
            <Image className="h-5 w-5" />
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="dark:text-white dark:hover:bg-gray-800"
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("messages.typeMessage")}
            className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() && !imagePreview}
            className={`${
              message.trim() || imagePreview
                ? isAthlete ? "text-athlete" : "text-scout"
                : "text-gray-400"
            } dark:hover:bg-gray-800`}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
