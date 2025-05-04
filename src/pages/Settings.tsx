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

  const confirmLogout = async () => {
    await logout();
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
      <main className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Account Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.account")}</CardTitle>
              <CardDescription>{t("settings.accountDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Information */}
              <div className="space-y-2">
                <Label>{t("settings.profileInfo")}</Label>
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="space-y-2">
                <Label>{t("settings.privacySecurity")}</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.language")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={language}
                onValueChange={(value) => handleLanguageChange(value as "en" | "sv")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">{t("settings.english")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sv" id="sv" />
                  <Label htmlFor="sv">{t("settings.swedish")}</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>{t("settings.preferences")}</CardTitle>
              <CardDescription>{t("settings.prefDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-gray-400" />
                  <span>{t("settings.darkMode")}</span>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
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
