import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Hash, User, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchProfilesAndHashtags } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    profiles: any[];
    hashtags: string[];
  }>({ profiles: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Save recent searches to localStorage
  const addRecentSearch = (search: string) => {
    if (!search) return;
    let updated = [search, ...recentSearches.filter(s => s !== search)];
    if (updated.length > 10) updated = updated.slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ profiles: [], hashtags: [] });
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchProfilesAndHashtags(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleProfileClick = (profileId: string, name: string) => {
    addRecentSearch(name);
    navigate(`/user/${profileId}`);
    onOpenChange(false);
  };

  const handleHashtagClick = (hashtag: string) => {
    addRecentSearch(`#${hashtag}`);
    navigate(`/hashtag/${hashtag}`);
    onOpenChange(false);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search.startsWith('#') ? search.slice(1) : search);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 max-w-full w-full h-full m-0 p-0 flex flex-col bg-white dark:bg-black z-[100] rounded-none border-none">
        <div className="flex items-center space-x-2 px-4 pt-4 pb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search profiles and hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg bg-gray-100 dark:bg-gray-900 rounded-full"
              autoFocus
            />
            {query && (
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setQuery("")}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Recent Searches</span>
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={clearRecentSearches}
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  onClick={() => handleRecentClick(search)}
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4 mt-2">
          {loading ? (
            <div className="text-center py-4">Searching...</div>
          ) : (
            <>
              {/* Profiles */}
              {results.profiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profiles
                  </h3>
                  <div className="space-y-2">
                    {results.profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleProfileClick(profile.id, profile.full_name)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">{profile.full_name}</span>
                            <Badge className="text-xs">{profile.role}</Badge>
                          </div>
                          <span className="text-sm text-gray-500 truncate">@{profile.username}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {results.hashtags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hashtags
                  </h3>
                  <div className="space-y-2">
                    {results.hashtags.map((hashtag) => (
                      <div
                        key={hashtag}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleHashtagClick(hashtag)}
                      >
                        <div className="flex-1">
                          <span className="font-semibold">#{hashtag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && query && results.profiles.length === 0 && results.hashtags.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
