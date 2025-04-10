
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, UserPlus } from "lucide-react";
import TeamCard from "./TeamCard";

const mockTeams = [
  {
    id: "1",
    name: "Brooklyn Nets Academy",
    type: "Basketball",
    location: "Brooklyn, NY",
    memberCount: 34,
    foundedYear: 2012,
    stats: { "Wins": "22", "Losses": "8", "Win %": "73%" }
  },
  {
    id: "2",
    name: "Golden Eagles FC",
    type: "Soccer",
    location: "Los Angeles, CA",
    memberCount: 26,
    foundedYear: 2015,
    stats: { "Wins": "16", "Losses": "10", "Win %": "62%" }
  },
  {
    id: "3",
    name: "Miami Dolphins Youth",
    type: "Football",
    location: "Miami, FL",
    memberCount: 42,
    foundedYear: 2010,
    stats: { "Wins": "19", "Losses": "13", "Win %": "59%" }
  },
  {
    id: "4",
    name: "Chicago Bulls Academy",
    type: "Basketball",
    location: "Chicago, IL",
    memberCount: 28,
    foundedYear: 2016,
    stats: { "Wins": "14", "Losses": "6", "Win %": "70%" }
  },
  {
    id: "5",
    name: "Dallas Cowboys Youth",
    type: "Football",
    location: "Dallas, TX",
    memberCount: 36,
    foundedYear: 2013,
    stats: { "Wins": "17", "Losses": "11", "Win %": "61%" }
  },
  {
    id: "6",
    name: "Seattle Sounders Academy",
    type: "Soccer",
    location: "Seattle, WA",
    memberCount: 30,
    foundedYear: 2014,
    stats: { "Wins": "20", "Losses": "9", "Win %": "69%" }
  }
];

interface TeamContentProps {
  filterSport?: string;
}

const TeamContent = ({ filterSport }: TeamContentProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: filterSport || "",
    location: "",
    foundedAfter: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(4);
  const [viewTeam, setViewTeam] = useState<string | null>(null);
  
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const filteredTeams = mockTeams.filter(team => {
    if (search && !team.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    if (filters.type && team.type !== filters.type) {
      return false;
    }
    
    if (filters.location && !team.location.includes(filters.location)) {
      return false;
    }
    
    if (filters.foundedAfter && team.foundedYear < parseInt(filters.foundedAfter)) {
      return false;
    }
    
    return true;
  });

  const handleLoadMore = () => {
    setDisplayCount(Math.min(displayCount + 4, filteredTeams.length));
  };

  const handleViewTeam = (id: string) => {
    setViewTeam(id);
  };

  return (
    <div className="space-y-4 pb-16">
      <Card className="team-card">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search teams..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-team text-white" : ""}
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
                  value={filters.type} 
                  onValueChange={(value) => handleFilterChange("type", value)}
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
                <Label className="text-xs">Location</Label>
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => handleFilterChange("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Miami">Miami</SelectItem>
                    <SelectItem value="Dallas">Dallas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Founded After</Label>
                <Select 
                  value={filters.foundedAfter} 
                  onValueChange={(value) => handleFilterChange("foundedAfter", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Year</SelectItem>
                    <SelectItem value="2010">2010</SelectItem>
                    <SelectItem value="2012">2012</SelectItem>
                    <SelectItem value="2015">2015</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card className="team-card">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Featured Team</CardTitle>
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamCard 
              name="Golden State Warriors Academy"
              type="Basketball"
              isFullProfile={true}
              stats={{ "Wins": "25", "Losses": "5", "Win %": "83%" }}
              location="San Francisco, CA"
              memberCount={40}
              foundedYear={2010}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="team-card">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {filteredTeams.length} Teams Found
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-team"
          >
            <UserPlus className="h-4 w-4" /> Create Team
          </Button>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeams.slice(0, displayCount).map((team) => (
              <TeamCard 
                key={team.id}
                name={team.name}
                type={team.type}
                location={team.location}
                memberCount={team.memberCount}
                foundedYear={team.foundedYear}
                onViewProfile={() => handleViewTeam(team.id)}
              />
            ))}
          </div>
        </CardContent>
        {displayCount < filteredTeams.length && (
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full text-team" onClick={handleLoadMore}>
              Load More
            </Button>
          </CardFooter>
        )}
      </Card>

      {viewTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="p-4">
              {(() => {
                const team = mockTeams.find(t => t.id === viewTeam);
                if (!team) return null;
                
                return (
                  <div>
                    <TeamCard 
                      name={team.name}
                      type={team.type}
                      location={team.location}
                      memberCount={team.memberCount}
                      foundedYear={team.foundedYear}
                      isFullProfile={true}
                      stats={team.stats}
                    />
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="mr-2" onClick={() => setViewTeam(null)}>
                        Close
                      </Button>
                      <Button className="bg-team hover:bg-team/90">
                        <UserPlus className="mr-1 h-4 w-4" />
                        Join Team
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamContent;
