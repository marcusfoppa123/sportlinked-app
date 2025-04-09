
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Menu } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ContentFeed from "@/components/ContentFeed";
import UploadButton from "@/components/UploadButton";

const ForYou = () => {
  const { user } = useAuth();
  const isAthlete = user?.role === "athlete";
  const [activeTab, setActiveTab] = useState("for-you");
  
  const sportTabs = [
    { id: "for-you", label: "For You" },
    { id: "basketball", label: "Basketball" },
    { id: "football", label: "Football" },
    { id: "soccer", label: "Soccer" },
    { id: "baseball", label: "Baseball" }
  ];

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6" />
            <h1 className={`text-xl font-bold ${isAthlete ? "text-athlete" : "text-scout"}`}>
              SportLinked
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
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
                  className={`px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-medium data-[state=active]:border-b-2 ${
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

      {/* Main content */}
      <main className="container px-4 py-4">
        <ContentFeed filterSport={activeTab !== "for-you" ? activeTab : undefined} />
      </main>

      {/* Upload button for athletes */}
      {isAthlete && <UploadButton />}
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ForYou;
