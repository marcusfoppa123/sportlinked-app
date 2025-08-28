
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Login from "@/components/Login";
import ViralPostsGrid from "@/components/ViralPostsGrid";

const Athletes = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const isAthlete = user?.role === "athlete";
  
  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Discover</h1>
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
              onClick={() => setShowLogin(true)}
            >
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        {showLogin && !isAuthenticated ? (
          <div className="bg-card rounded-lg p-4 shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Join to see viral content</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLogin(false)}
                className="hover:bg-accent"
              >
                Browse as guest
              </Button>
            </div>
            <Login initialRole="athlete" />
          </div>
        ) : (
          <ViralPostsGrid />
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Athletes;
