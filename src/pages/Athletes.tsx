
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Login from "@/components/Login";
import ContentFeed from "@/components/ContentFeed";

const Athletes = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);
  const isAthlete = user?.role === "athlete";
  
  return (
    <div className="athlete-theme min-h-screen pb-16 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-athlete text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("athletes.title")}</h1>
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
              onClick={() => setShowLogin(true)}
            >
              {t("athletes.login")}
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        {showLogin && !isAuthenticated ? (
          <div className="bg-[#E6F4FF] rounded-lg p-4 shadow-md dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-athlete dark:text-white">{t("athletes.athleteLogin")}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLogin(false)}
                className="text-athlete hover:bg-athlete/10 dark:text-white dark:hover:bg-gray-700"
              >
                {t("athletes.guestBrowse")}
              </Button>
            </div>
            <Login initialRole="athlete" />
          </div>
        ) : (
          <ContentFeed contentType="profiles" />
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Athletes;
