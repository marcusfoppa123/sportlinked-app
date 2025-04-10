
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, Home, MessageSquare, Bell, Settings, Users } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";
  const isTeam = user?.role === "team";
  
  // Determine the profile link based on user role
  const profileLink = isTeam ? "/team-profile" : "/profile";

  const navItems = [
    {
      name: "Profile",
      path: profileLink,
      icon: <User size={24} />
    },
    {
      name: "For You",
      path: "/for-you",
      icon: <Home size={24} />
    },
    {
      name: "Athletes",
      path: "/athletes",
      icon: <Users size={24} />
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <MessageSquare size={24} />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={24} />
    }
  ];

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center border-t px-2 py-1 bg-white shadow-md ${
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
              : "text-gray-500"
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
