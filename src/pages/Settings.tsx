import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronRight, Bell, Shield, UserCircle, MessageSquare, LogOut, Sun, Moon, Languages, InfoIcon } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const iconColor = isAthlete ? "text-blue-500" : user?.role === "scout" ? "text-green-500" : "text-yellow-500";
  const iconColorHex = isAthlete ? "#2979FF" : user?.role === "scout" ? "#00C853" : "#FFD600";
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const languageOptions = [
    { value: "en", label: t("settings.english") },
    { value: "sv", label: t("settings.swedish") },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/");
    window.location.reload();
  };

  const handleLanguageChange = (newLang: "en" | "sv") => {
    setLanguage(newLang);
    setShowLanguageMenu(false);
    toast.success(newLang === "en" ? "Language changed to English" : "Språk ändrat till Svenska");
  };

  // Add a click/blur handler to close the menu if user clicks outside
  const languageMenuRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!showLanguageMenu) return;
    function handleClick(event: MouseEvent) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLanguageMenu]);

  // For logout button color
  const logoutButtonColor = isAthlete ? "bg-blue-500 hover:bg-blue-600 text-white" : user?.role === "scout" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-black";

  return (
    <div className={`min-h-screen pb-16 bg-white dark:bg-gray-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm dark:bg-gray-900">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("settings.title")}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-0 py-4 max-w-lg">
        <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
          {/* Account Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">Account</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 w-full focus:outline-none">
                <span className="flex items-center gap-3 w-full">
                  <UserCircle className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Profile Information</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Content & Activity Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">Content & Activity</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 w-full focus:outline-none">
                <span className="flex items-center gap-3 w-full">
                  <Bell className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Notifications</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <button className="flex items-center justify-between py-3 w-full focus:outline-none">
                <span className="flex items-center gap-3 w-full">
                  <MessageSquare className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Messages</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <div className="relative flex items-center justify-between py-3 w-full cursor-pointer" onClick={() => setShowLanguageMenu(true)}>
                <span className="flex items-center gap-3 w-full">
                  <Languages className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Language</span>
                </span>
                <span className="text-sm text-gray-500 mr-2">{language === "en" ? "English" : "Swedish"}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
                {/* Language popup menu */}
                {showLanguageMenu && (
                  <div ref={languageMenuRef} className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-40 animate-fade-in-down">
                    {languageOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === opt.value ? 'font-bold text-primary' : ''}`}
                        onClick={() => { handleLanguageChange(opt.value as "en" | "sv"); setShowLanguageMenu(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between py-3 w-full">
                <Sun className={`h-5 w-5 ${iconColor}`} />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white w-full text-left">Dark Appearance</span>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">Legal</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 w-full focus:outline-none" onClick={() => navigate('/terms')}>
                <span className="flex items-center gap-3 w-full">
                  <InfoIcon className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Terms of Service</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <button className="flex items-center justify-between py-3 w-full focus:outline-none" onClick={() => navigate('/privacy')}>
                <span className="flex items-center gap-3 w-full">
                  <InfoIcon className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-gray-900 dark:text-white w-full text-left">Privacy Policy</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 pt-4 pb-4">
            <Button 
              className={`w-full ${logoutButtonColor} font-bold rounded-xl py-3 mt-2 shadow-md border-none`}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 text-white" />
              {t("settings.logout")}
            </Button>
          </div>
        </div>
      </main>
      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.confirmLogout")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.logoutDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("settings.confirmNo")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>{t("settings.confirmYes")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Settings;
