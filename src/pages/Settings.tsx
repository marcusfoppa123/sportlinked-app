
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
import { ChevronRight, Bell, Shield, UserCircle, MessageSquare, LogOut, Sun, Moon, Languages } from "lucide-react";
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

  const confirmLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleLanguageChange = (newLang: "en" | "sv") => {
    setLanguage(newLang);
    toast.success(newLang === "en" ? "Language changed to English" : "Språk ändrat till Svenska");
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm dark:bg-gray-900">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("settings.title")}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        <div className="space-y-4">
          {/* Account settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.account")}</CardTitle>
              <CardDescription>{t("settings.accountDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{t("settings.profileInfo")}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{t("settings.privacySecurity")}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Languages className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{t("settings.language")}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={language === "en" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleLanguageChange("en")}
                    className={language === "en" ? "bg-primary" : ""}
                  >
                    {t("settings.english")}
                  </Button>
                  <Button 
                    variant={language === "sv" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleLanguageChange("sv")}
                    className={language === "sv" ? "bg-primary" : ""}
                  >
                    {t("settings.swedish")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.preferences")}</CardTitle>
              <CardDescription>{t("settings.prefDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{t("settings.pushNotif")}</span>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
                  <span>{t("settings.emailNotif")}</span>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 mr-3 text-gray-500" />
                  ) : (
                    <Sun className="h-5 w-5 mr-3 text-gray-500" />
                  )}
                  <span>{t("settings.darkMode")}</span>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* About */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.about")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2">
                <span>{t("settings.version")}</span>
                <span className="text-gray-500">1.0.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span>{t("settings.terms")}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-between py-2">
                <span>{t("settings.privacy")}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          {/* Logout */}
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("settings.logout")}
          </Button>
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
