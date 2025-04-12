
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Search, Clock, User } from "lucide-react";

// Sample user data
const sampleUsers = [
  {
    id: "1",
    name: "Michael Jordan",
    role: "athlete",
    profilePic: "",
    sport: "Basketball",
    position: "Shooting Guard"
  },
  {
    id: "2",
    name: "Chicago Bulls",
    role: "team",
    profilePic: "",
    sport: "Basketball",
    location: "Chicago, IL"
  },
  {
    id: "3",
    name: "Phil Jackson",
    role: "scout",
    profilePic: "",
    sport: "Basketball",
    organization: "Lakers"
  },
  {
    id: "4",
    name: "Serena Williams",
    role: "athlete",
    profilePic: "",
    sport: "Tennis",
    position: "Singles"
  },
  {
    id: "5",
    name: "Boston Celtics",
    role: "team",
    profilePic: "",
    sport: "Basketball",
    location: "Boston, MA"
  }
];

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  role: string;
  profilePic?: string;
  sport?: string;
  position?: string;
  location?: string;
  organization?: string;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      // Search for users
      const results = sampleUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.sport && user.sport.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.organization && user.organization.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setShowNoResults(results.length === 0);
    } else {
      setSearchResults([]);
      setShowNoResults(false);
    }
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Save to recent searches if not already present
      if (!recentSearches.includes(searchQuery)) {
        const newRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
      }
    }
  };
  
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };
  
  const handleSelectRecentSearch = (search: string) => {
    setSearchQuery(search);
  };
  
  const handleProfileClick = (userId: string) => {
    // In a real app, navigate to the correct profile page
    // For now, just close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader className="px-4 py-3 border-b dark:border-gray-800">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="flex-1 border-none shadow-none focus-visible:ring-0 pl-0 dark:bg-transparent dark:text-white"
              autoFocus
            />
            {searchQuery && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchQuery("")}
                className="h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto py-2">
          {/* Recent searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  {t("search.recentSearches")}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearRecentSearches}
                  className="h-6 px-2 text-xs text-muted-foreground dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {t("search.clearRecent")}
                </Button>
              </div>
              
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSelectRecentSearch(search)}
                    className="w-full justify-start text-sm py-1.5 px-2 h-auto dark:hover:bg-gray-800 dark:text-gray-300"
                  >
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground dark:text-gray-400" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium mb-2 dark:text-gray-300">
                {t("search.results")}
              </h3>
              
              <div className="space-y-2">
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => handleProfileClick(user.id)}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-gray-800"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback className={
                        user.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                        user.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-green-100 text-green-800"
                      }>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium dark:text-white">{user.name}</span>
                        <Badge variant="outline" className={
                          user.role === "athlete" ? "athlete-badge" : 
                          user.role === "team" ? "team-badge" : 
                          "scout-badge"
                        }>
                          {user.role === "athlete" ? t("auth.athlete") : 
                           user.role === "team" ? t("auth.team") : 
                           t("auth.scout")}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground dark:text-gray-400">
                        {user.sport}
                        {user.position && ` • ${user.position}`}
                        {user.location && ` • ${user.location}`}
                        {user.organization && ` • ${user.organization}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No results */}
          {showNoResults && (
            <div className="px-4 py-8 text-center">
              <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground dark:text-gray-500" />
              <h3 className="text-base font-medium mb-1 dark:text-white">
                {t("search.noResults")}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {t("search.tryAgain")}
              </p>
            </div>
          )}
          
          {/* Initial suggestions when no search term */}
          {!searchQuery && searchResults.length === 0 && recentSearches.length === 0 && (
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium mb-2 dark:text-gray-300">
                {t("search.suggestions")}
              </h3>
              
              <div className="space-y-2">
                {sampleUsers.slice(0, 3).map(user => (
                  <div 
                    key={user.id}
                    onClick={() => handleProfileClick(user.id)}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-gray-800"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback className={
                        user.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                        user.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-green-100 text-green-800"
                      }>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium dark:text-white">{user.name}</span>
                        <Badge variant="outline" className={
                          user.role === "athlete" ? "athlete-badge" : 
                          user.role === "team" ? "team-badge" : 
                          "scout-badge"
                        }>
                          {user.role === "athlete" ? t("auth.athlete") : 
                           user.role === "team" ? t("auth.team") : 
                           t("auth.scout")}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground dark:text-gray-400">
                        {user.sport}
                        {user.position && ` • ${user.position}`}
                        {user.location && ` • ${user.location}`}
                        {user.organization && ` • ${user.organization}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
