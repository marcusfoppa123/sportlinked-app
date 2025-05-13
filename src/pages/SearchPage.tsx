
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, User, Hash, X } from "lucide-react";
import { searchProfilesAndHashtags } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNavigation from "@/components/BottomNavigation";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<{
    profiles: any[];
    hashtags: string[];
  }>({
    profiles: [],
    hashtags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchProfilesAndHashtags(query);
      // Type assertion to ensure hashtags are of type string[]
      setSearchResults({
        profiles: results.profiles || [],
        hashtags: (results.hashtags || []) as string[]
      });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchParams({ q: searchQuery });
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults({ profiles: [], hashtags: [] });
    setSearchParams({});
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleProfileClick = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  const handleHashtagClick = (hashtag: string) => {
    // Remove # if it exists
    const cleanHashtag = hashtag.replace(/^#/, '');
    navigate(`/hashtag/${cleanHashtag}`);
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border">
        <div className="container px-4 h-16 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athletes, teams, hashtags..."
                className="pl-10 pr-10 py-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                autoFocus
              />
              {searchQuery && (
                <Button
                  type="button" 
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="hidden">Search</Button>
          </form>
        </div>
      </header>

      <main className="flex-1 container px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Profiles section */}
            {searchResults.profiles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profiles
                </h2>
                <div className="space-y-3">
                  {searchResults.profiles.map((profile) => (
                    <div 
                      key={profile.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleProfileClick(profile.id)}
                    >
                      <Avatar className="h-12 w-12">
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
                        <div className="font-medium dark:text-white">{profile.full_name || profile.username}</div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 dark:border-gray-600 dark:text-gray-300">
                            {profile.role}
                          </Badge>
                          {profile.username && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags section */}
            {searchResults.hashtags.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Hashtags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {searchResults.hashtags.map((hashtag) => (
                    <Badge 
                      key={hashtag}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm cursor-pointer flex items-center gap-1 dark:bg-gray-800 dark:hover:bg-gray-700"
                      onClick={() => handleHashtagClick(hashtag)}
                    >
                      <Hash className="h-3.5 w-3.5" />
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {searchQuery && 
              searchParams.has("q") && 
              searchResults.profiles.length === 0 && 
              searchResults.hashtags.length === 0 && 
              !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">No results found</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    We couldn't find any matches for "{searchParams.get("q")}". Try checking for typos or using different keywords.
                  </p>
                </div>
              )
            }

            {/* Initial state */}
            {!searchParams.has("q") && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Search SportsLinked</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Find athletes, teams, or topics by entering keywords above.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
