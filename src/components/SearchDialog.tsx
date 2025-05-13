
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, User, Hash } from "lucide-react";
import { searchProfilesAndHashtags } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<{
    profiles: any[];
    hashtags: string[];
  }>({
    profiles: [],
    hashtags: [],
  });
  const [loading, setLoading] = useState(false);

  // Function to get initials of a name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle search as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({
        profiles: [],
        hashtags: [],
      });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchProfilesAndHashtags(searchQuery);
        
        // Type assertion to ensure hashtags are of type string[]
        const typedResults = {
          profiles: results.profiles || [],
          hashtags: (results.hashtags || []) as string[]
        };
        
        setSearchResults(typedResults);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleProfileClick = (profileId: string) => {
    navigate(`/profile/${profileId}`);
    onClose();
  };

  const handleHashtagClick = (hashtag: string) => {
    // Remove # if it exists
    const cleanHashtag = hashtag.replace(/^#/, '');
    navigate(`/hashtag/${cleanHashtag}`);
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({
      profiles: [],
      hashtags: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center p-4 border-b dark:border-gray-800">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
          <Input
            placeholder={t("search.searchSportsLinked")}
            className="border-none shadow-none focus-visible:ring-0 flex-1 dark:bg-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-4 py-2 bg-transparent">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary dark:text-gray-400 dark:data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="profiles" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary dark:text-gray-400 dark:data-[state=active]:text-white"
            >
              Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="hashtags" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary dark:text-gray-400 dark:data-[state=active]:text-white"
            >
              Hashtags
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="all" className="m-0 p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {searchResults.profiles.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-medium px-2 py-1 text-gray-500 dark:text-gray-400">Profiles</h3>
                      {searchResults.profiles.map((profile) => (
                        <div 
                          key={profile.id} 
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                          onClick={() => handleProfileClick(profile.id)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className={
                              profile.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                              profile.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-green-100 text-green-800"
                            }>
                              {getInitials(profile.full_name || profile.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm dark:text-white">{profile.full_name || profile.username}</p>
                            <div className="flex items-center">
                              <Badge variant="outline" className="h-5 mr-2 dark:border-gray-700 dark:text-gray-300">
                                {profile.role}
                              </Badge>
                              {profile.username && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">@{profile.username}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.hashtags.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-medium px-2 py-1 text-gray-500 dark:text-gray-400">Hashtags</h3>
                      <div className="flex flex-wrap gap-2 p-2">
                        {searchResults.hashtags.map((hashtag) => (
                          <Badge 
                            key={hashtag} 
                            variant="secondary"
                            className="cursor-pointer px-3 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-1"
                            onClick={() => handleHashtagClick(hashtag)}
                          >
                            <Hash className="h-3 w-3" />
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery && searchResults.profiles.length === 0 && searchResults.hashtags.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profiles" className="m-0 p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {searchResults.profiles.length > 0 ? (
                    searchResults.profiles.map((profile) => (
                      <div 
                        key={profile.id} 
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                        onClick={() => handleProfileClick(profile.id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback className={
                            profile.role === "athlete" ? "bg-blue-100 text-blue-800" : 
                            profile.role === "team" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-green-100 text-green-800"
                          }>
                            {getInitials(profile.full_name || profile.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm dark:text-white">{profile.full_name || profile.username}</p>
                          <div className="flex items-center">
                            <Badge variant="outline" className="h-5 mr-2 dark:border-gray-700 dark:text-gray-300">
                              {profile.role}
                            </Badge>
                            {profile.username && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">@{profile.username}</span>
                            )}
                          </div>
                        </div>
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    searchQuery && !loading && (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <User className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No profiles found for "{searchQuery}"</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hashtags" className="m-0 p-2">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {searchResults.hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-2">
                      {searchResults.hashtags.map((hashtag) => (
                        <Badge 
                          key={hashtag} 
                          variant="secondary"
                          className="cursor-pointer px-3 py-2 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center gap-1"
                          onClick={() => handleHashtagClick(hashtag)}
                        >
                          <Hash className="h-3 w-3" />
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    searchQuery && !loading && (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Hash className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No hashtags found for "{searchQuery}"</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
