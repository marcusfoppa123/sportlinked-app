import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Menu, Settings, RefreshCw } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ContentFeed from "@/components/ContentFeed";
import UploadButton from "@/components/UploadButton";
import SideMenu from "@/components/SideMenu";
import SearchDialog from "@/components/SearchDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/sportslinked-in-app.png";

const ForYou = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAthlete = user?.role === "athlete";
  const [activeTab, setActiveTab] = useState("for-you");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of ContentFeed
  
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [location.pathname]);
  
  const sportTabs = [
    { id: "for-you", label: t("nav.forYou") },
    { id: "basketball", label: "Basketball" },
    { id: "football", label: "Football" },
    { id: "soccer", label: "Soccer" },
    { id: "baseball", label: "Baseball" }
  ];
  
  const handleRefresh = () => {
    setRefreshing(true);
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Feed refreshed");
    }, 1000);
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSideMenuOpen(true)}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="SportsLinked Logo" 
                className="h-12 w-auto mr-2"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              className="dark:text-white dark:hover:bg-gray-800"
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(true)}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/settings")}
              className="dark:text-white dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="container px-4 overflow-x-auto pb-2 scrollbar-none">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent p-0 h-10">
              {sportTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:border-b-2 dark:text-gray-300 dark:data-[state=active]:text-white ${
                    isAthlete 
                      ? "data-[state=active]:text-athlete data-[state=active]:border-athlete" 
                      : "data-[state=active]:text-scout data-[state=active]:border-scout"
                  }`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container px-4 py-4">
        <ContentFeed 
          key={key} 
          filterSport={activeTab !== "for-you" ? activeTab : undefined} 
          contentType="posts"
          showAllPosts={true} // Show all posts on the home page
        />
      </main>

      {isAthlete && <UploadButton />}
      
      <BottomNavigation />
    </div>
  );
};

export default ForYou;
