import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import ForYou from "./pages/ForYou";
import Profile from "./pages/Profile";
import TeamProfile from "./pages/TeamProfile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Athletes from "./pages/Athletes";
import CreatePost from "./pages/CreatePost";
import Subscriptions from "./pages/Subscriptions";
import SavedItems from "./pages/SavedItems";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [forceShowSplash, setForceShowSplash] = useState(false);
  
  // Check if the splash screen has been shown before
  useEffect(() => {
    // Check URL parameters first for force show
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('showSplash')) {
      setForceShowSplash(true);
      setShowSplash(true);
      return;
    }
    
    // Otherwise, check localStorage
    const splashShown = localStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);
  
  // Listen for special key combination to show splash (for testing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+S to trigger splash screen
      if (e.ctrlKey && e.altKey && e.key === 's') {
        setForceShowSplash(true);
        setShowSplash(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
    setForceShowSplash(false);
    // Save to local storage that splash has been shown
    localStorage.setItem("splashShown", "true");
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash ? (
                <SplashScreen onComplete={handleSplashComplete} forceShow={forceShowSplash} />
              ) : (
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/for-you" element={<ForYou />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/team-profile" element={<TeamProfile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/athletes" element={<Athletes />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/saved" element={<SavedItems />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              )}
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
