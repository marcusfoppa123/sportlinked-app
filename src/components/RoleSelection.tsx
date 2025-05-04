import React from "react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RoleSelection = () => {
  const { setRole } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    console.log("Selected role:", role); // Add logging to help debug
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to SportLinked</h1>
        <p className="text-muted-foreground">Select your role to get started</p>
      </motion.div>

      <div className="w-full max-w-md grid gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-2 hover:border-athlete cursor-pointer overflow-hidden">
            <CardHeader className="pb-2" style={{ backgroundColor: '#1877c0' }}>
              <CardTitle className="text-white">Athlete</CardTitle>
              <CardDescription className="text-white/80">For players and athletes of all levels</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-athlete mr-2"></span>
                  Share your highlights and stats
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-athlete mr-2"></span>
                  Connect with scouts and coaches
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-athlete mr-2"></span>
                  Discover opportunities in your sport
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-athlete hover:bg-athlete/90" 
                onClick={() => handleRoleSelect("athlete")}
              >
                Continue as Athlete
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-2 hover:border-scout cursor-pointer overflow-hidden">
            <CardHeader className="pb-2" style={{ backgroundColor: '#238d4b' }}>
              <CardTitle className="text-white">Scout</CardTitle>
              <CardDescription className="text-white/80">For coaches, recruiters and sports organizations</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-scout mr-2"></span>
                  Discover talented athletes
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-scout mr-2"></span>
                  Filter by sport, position, and stats
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-scout mr-2"></span>
                  Contact and recruit prospects directly
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-scout hover:bg-scout/90" 
                onClick={() => handleRoleSelect("scout")}
              >
                Continue as Scout
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-2 hover:border-team cursor-pointer overflow-hidden">
            <CardHeader className="pb-2" style={{ backgroundColor: '#e6c74c' }}>
              <CardTitle className="text-white">Team/Club</CardTitle>
              <CardDescription className="text-white/80">For sports teams, clubs and organizations</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-team mr-2"></span>
                  Showcase your team and achievements
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-team mr-2"></span>
                  Connect with athletes and scouts
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-team mr-2"></span>
                  Recruit and build your roster
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-team hover:bg-team/90 text-white" 
                onClick={() => handleRoleSelect("team")}
              >
                Continue as Team/Club
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
