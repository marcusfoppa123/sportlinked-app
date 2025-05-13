import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useSplashScreen } from "@/hooks/useSplashScreen";
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
import PostPage from "./pages/PostPage";
import Login from "./components/Login";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UserProfile from "@/pages/UserProfile";
import NotificationSettings from "@/pages/NotificationSettings";
import MessageSettings from "@/pages/MessageSettings";
import SearchPage from "./pages/SearchPage";
import HashtagPage from "./pages/HashtagPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/for-you" element={<ForYou />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/team-profile" element={<TeamProfile />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="/messages" element={<Messages />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/notification-settings" element={<NotificationSettings />} />
    <Route path="/message-settings" element={<MessageSettings />} />
    <Route path="/athletes" element={<Athletes />} />
    <Route path="/create-post" element={<CreatePost />} />
    <Route path="/subscriptions" element={<Subscriptions />} />
    <Route path="/saved" element={<SavedItems />} />
    <Route path="/post/:postId" element={<PostPage />} />
    <Route path="/user/:userId" element={<UserProfile />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/register" element={<Login showRegister={true} initialRole={null} />} />
    <Route path="/terms" element={<TermsOfService />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/hashtag/:hashtag" element={<HashtagPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const { showSplash, handleSplashComplete } = useSplashScreen();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {showSplash ? (
                  <SplashScreen onComplete={handleSplashComplete} />
                ) : (
                  <AppRoutes />
                )}
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
