
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  User, 
  Settings, 
  MessageCircle, 
  Bell, 
  Search, 
  Users, 
  Bookmark,
  HelpCircle,
  CreditCard
} from "lucide-react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";
  const isTeam = user?.role === "team";
  
  // Determine the profile link based on user role
  const profileLink = isTeam ? "/team-profile" : "/profile";
  
  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const menuItems = [
    { icon: Home, label: t("menu.home"), path: "/for-you" },
    { icon: Search, label: t("menu.explore"), path: "/athletes" },
    { icon: User, label: t("menu.myProfile"), path: profileLink },
    { icon: Bookmark, label: t("menu.savedItems"), path: "/saved" },
    { icon: MessageCircle, label: t("menu.messages"), path: "/messages" },
    { icon: Bell, label: t("menu.notifications"), path: "/notifications" },
    { icon: CreditCard, label: "subscriptions", path: "/subscriptions" },
    { icon: Settings, label: t("menu.settings"), path: "/settings" },
    { icon: HelpCircle, label: t("menu.help"), path: "/help" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 dark:bg-gray-900 dark:border-gray-800">
        <SheetHeader className="p-6 border-b border-border dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className={`text-lg ${
                isAthlete ? "bg-blue-100 text-blue-800" : 
                isTeam ? "bg-yellow-100 text-yellow-800" : 
                "bg-green-100 text-green-800"
              }`}>
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <SheetTitle className="text-xl font-semibold dark:text-white">
                {user?.name || "User Name"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </SheetHeader>
        
        <div className="py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-4 px-3 py-3 text-sm font-medium rounded-md hover:bg-muted dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
