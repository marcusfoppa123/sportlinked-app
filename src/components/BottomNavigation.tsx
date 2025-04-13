
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusCircle, Bell, User, MessageCircle, Heart, CreditCard } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";
  
  const navigationItems = [
    {
      path: "/for-you",
      label: "Home",
      icon: <Home className="h-6 w-6" />
    },
    {
      path: "/athletes",
      label: "Discover",
      icon: <Search className="h-6 w-6" />
    },
    {
      path: "/messages",
      label: "Messages",
      icon: <MessageCircle className="h-6 w-6" />
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <Bell className="h-6 w-6" />
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <User className="h-6 w-6" />
    },
    {
      path: "/subscriptions",
      label: "Subscriptions",
      icon: <CreditCard className="h-6 w-6" />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            className={`flex flex-col items-center justify-center h-14 w-14 rounded-none ${
              isActive(item.path)
                ? isAthlete
                  ? "text-athlete border-t-2 border-athlete"
                  : "text-scout border-t-2 border-scout"
                : "text-muted-foreground dark:text-gray-400"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
