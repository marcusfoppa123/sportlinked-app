
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star } from "lucide-react";
import ProfileCard from "./ProfileCard";

// Mock data for athletes
const mockAthletes = [
  {
    id: "1",
    name: "Michael Johnson",
    role: "athlete",
    sport: "Basketball",
    position: "Shooting Guard",
    stats: { "PPG": "23.4", "APG": "5.2", "RPG": "3.8" },
    location: "New York, NY",
    experience: "College"
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "athlete",
    sport: "Soccer",
    position: "Forward",
    stats: { "Goals": "18", "Assists": "12", "Shots": "56" },
    location: "Los Angeles, CA",
    experience: "Professional"
  },
  {
    id: "3",
    name: "Carlos Rodriguez",
    role: "athlete",
    sport: "Baseball",
    position: "Pitcher",
    stats: { "ERA": "2.84", "SO": "87", "WHIP": "1.12" },
    location: "Miami, FL",
    experience: "College"
  },
  {
    id: "4",
    name: "Emily Chen",
    role: "athlete",
    sport: "Basketball",
    position: "Point Guard",
    stats: { "PPG": "17.2", "APG": "9.3", "SPG": "2.1" },
    location: "Chicago, IL",
    experience: "High School"
  },
  {
    id: "5",
    name: "David Thompson",
    role: "athlete",
    sport: "Football",
    position: "Quarterback",
    stats: { "YDS": "3280", "TD": "28", "INT": "7" },
    location: "Dallas, TX",
    experience: "College"
  },
  {
    id: "6",
    name: "Jessica Martinez",
    role: "athlete",
    sport: "Soccer",
    position: "Midfielder",
    stats: { "Goals": "8", "Assists": "15", "Passes": "843" },
    location: "Seattle, WA",
    experience: "College"
  }
];

interface ScoutContentProps {
  filterSport?: string;
}

const ScoutContent = ({ filterSport }: ScoutContentProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    sport: filterSport || "",
    position: "",
    experience: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const filteredAthletes = mockAthletes.filter(athlete => {
    // Apply search filter
    if (search && !athlete.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Apply sport filter
    if (filters.sport && athlete.sport !== filters.sport) {
      return false;
    }
    
    // Apply position filter
    if (filters.position && athlete.position !== filters.position) {
      return false;
    }
    
    // Apply experience filter
    if (filters.experience && athlete.experience !== filters.experience) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-4 pb-16">
      {/* Search and filter */}
      <Card className="scout-card">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search athletes..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-scout text-white" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-2 mt-4"
            >
              <div className="space-y-1">
                <Label className="text-xs">Sport</Label>
                <Select 
                  value={filters.sport} 
                  onValueChange={(value) => handleFilterChange("sport", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sports</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Baseball">Baseball</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Position</Label>
                <Select 
                  value={filters.position} 
                  onValueChange={(value) => handleFilterChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Positions</SelectItem>
                    <SelectItem value="Point Guard">Point Guard</SelectItem>
                    <SelectItem value="Shooting Guard">Shooting Guard</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                    <SelectItem value="Quarterback">Quarterback</SelectItem>
                    <SelectItem value="Pitcher">Pitcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Experience</Label>
                <Select 
                  value={filters.experience} 
                  onValueChange={(value) => handleFilterChange("experience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Featured athletes */}
      <Card className="scout-card">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Featured Athletes</CardTitle>
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileCard 
              user={{ name: "Alex Thompson", role: "athlete" }}
              sport="Basketball"
              position="Center"
              isFullProfile={true}
              stats={{ "PPG": "18.7", "RPG": "12.3", "BPG": "2.8" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Athletes list */}
      <Card className="scout-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {filteredAthletes.length} Athletes Found
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAthletes.map((athlete) => (
              <ProfileCard 
                key={athlete.id}
                user={{ name: athlete.name, role: athlete.role }}
                sport={athlete.sport}
                position={athlete.position}
              />
            ))}
          </div>
        </CardContent>
        {filteredAthletes.length > 6 && (
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full text-scout">
              Load More
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ScoutContent;
