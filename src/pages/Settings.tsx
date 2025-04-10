
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm dark:bg-gray-900">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        <div className="space-y-4">
          {/* Account settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center">
                  <UserCircle className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Privacy & Security</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between py-2 cursor-pointer">
                <div className="flex items-center">
                  <Languages className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Language</span>
                </div>
                <span className="text-sm text-gray-500">English</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Push Notifications</span>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Email Notifications</span>
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
                  <span>Dark Appearance</span>
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
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2">
                <span>Version</span>
                <span className="text-gray-500">1.0.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Terms of Service</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-between py-2">
                <span>Privacy Policy</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          {/* Logout */}
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </main>
      
      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account and redirected to the login screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Settings;
