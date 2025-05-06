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

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleLanguageChange = (newLang: "en" | "sv") => {
    setLanguage(newLang);
    toast.success(newLang === "en" ? "Language changed to English" : "Språk ändrat till Svenska");
  };

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
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">{t("settings.accountSection")}</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <span className="flex items-center gap-3">
                  <UserCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">{t("settings.profileInfo")}</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.privacySecurity")}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Content & Activity Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">{t("settings.contentSection")}</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <Bell className="h-5 w-5 text-yellow-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.notifications")}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.liveEvents")}</span>
                <span className="ml-2 text-xs text-red-500 font-bold">•</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <div className="flex items-center justify-between py-3">
                <Languages className="h-5 w-5 text-blue-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.language")}</span>
                <span className="text-sm text-gray-500 mr-2">{language === "en" ? t("settings.english") : t("settings.swedish")}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
              <div className="flex items-center justify-between py-3">
                <Sun className="h-5 w-5 text-green-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.darkMode")}</span>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wider">{t("settings.legalSection")}</div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <InfoIcon className="h-5 w-5 text-blue-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.terms")}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
              <button className="flex items-center justify-between py-3 focus:outline-none">
                <InfoIcon className="h-5 w-5 text-green-500" />
                <span className="flex-1 ml-3 text-gray-900 dark:text-white">{t("settings.privacy")}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 pt-4 pb-4">
            <Button 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl py-3 mt-2 shadow-md border-none"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 text-black" />
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
