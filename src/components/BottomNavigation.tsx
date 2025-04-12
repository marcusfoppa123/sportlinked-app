
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, Home, MessageSquare, Bell, Settings, Users } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  const isTeam = user?.role === "team";
  
  // Determine the profile link based on user role
  const profileLink = isTeam ? "/team-profile" : "/profile";

  const navItems = [
    {
      name: t("nav.profile"),
      path: profileLink,
      icon: <User size={24} />
    },
    {
      name: t("nav.forYou"),
      path: "/for-you",
      icon: <Home size={24} />
    },
    {
      name: t("nav.athletes"),
      path: "/athletes",
      icon: <Users size={24} />
    },
    {
      name: t("nav.messages"),
      path: "/messages",
      icon: <MessageSquare size={24} />
    },
    {
      name: t("nav.settings"),
      path: "/settings",
      icon: <Settings size={24} />
    }
  ];

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center border-t px-2 py-1 bg-white shadow-md dark:bg-gray-900 dark:border-gray-800 ${
        isAthlete ? "border-athlete" : isTeam ? "border-team" : "border-scout"
      }`}
    >
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`bottom-nav-item ${
            location.pathname === item.path
              ? `active ${
                  location.pathname === "/athletes" || location.pathname === "/team-profile"
                    ? "text-team"
                    : isAthlete
                    ? "text-athlete"
                    : "text-scout"
                }`
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;
