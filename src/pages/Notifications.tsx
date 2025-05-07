
import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const notifications = [
  {
    id: 1,
    section: "Most recent",
    avatar: "",
    title: "Coach Wilson accepted your connection request.",
    date: "Just now",
    description: "You are now connected with Coach Wilson. Start a conversation!"
  },
  {
    id: 2,
    section: "Most recent",
    avatar: "",
    title: "Alex Thompson mentioned you in a comment.",
    date: "5m ago",
    description: '"@you Great game last night!"'
  },
  {
    id: 3,
    section: "Today",
    avatar: "",
    title: "Michigan State liked your highlight video.",
    date: "2h ago",
    description: "Your highlight video is getting noticed!"
  },
  {
    id: 4,
    section: "Today",
    avatar: "",
    title: "Sarah Williams viewed your profile.",
    date: "3h ago",
    description: "A scout is interested in your profile."
  },
  {
    id: 5,
    section: "Earlier",
    avatar: "",
    title: "Welcome to SportLinked!",
    date: "1d ago",
    description: "Complete your profile to get noticed by scouts and teams."
  }
];

// Order sections: Most recent, Today, Earlier, ...
const sectionOrder = ["Most recent", "Today", "Earlier"];
const grouped = notifications.reduce((acc, n) => {
  acc[n.section] = acc[n.section] || [];
  acc[n.section].push(n);
  return acc;
}, {} as Record<string, typeof notifications>);

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 rounded-full p-1 hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <button className="rounded-full p-1 hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sectionOrder.map(section => {
          const sectionNotifications = grouped[section];
          if (!sectionNotifications?.length) return null;
          
          return (
            <div key={section} className="mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                {section}
              </h2>
              <div className="space-y-3">
                {sectionNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className="flex items-start bg-card p-3 rounded-lg shadow-sm"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>
                        {notification.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium leading-tight">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
