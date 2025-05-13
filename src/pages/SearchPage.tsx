import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Hash, User, X, Clock, ArrowLeft } from "lucide-react";
import { searchProfilesAndHashtags } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import BottomNavigation from "@/components/BottomNavigation";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    profiles: any[];
    hashtags: string[];
  }>({ profiles: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Helper to determine if searching for hashtags only
  const isHashtagSearch = debouncedQuery.trim().startsWith('#');

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

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
        const searchTerm = isHashtagSearch ? debouncedQuery.slice(1) : debouncedQuery;
        const searchResults = await searchProfilesAndHashtags(searchTerm);
        setResults({
          profiles: isHashtagSearch ? [] : searchResults.profiles,
          hashtags: searchResults.hashtags
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery, isHashtagSearch]);

  const handleProfileClick = (profileId: string, name: string) => {
    addRecentSearch(name);
    navigate(`/user/${profileId}`);
  };

  const handleHashtagClick = (hashtag: string) => {
    addRecentSearch(`#${hashtag}`);
    navigate(`/hashtag/${hashtag}`);
  };

  const handleRecentClick = (search: string) => {
    setQuery(search.startsWith('#') ? search : search);
  };

  const handleHashtagButton = () => {
    if (!query.startsWith('#')) {
      setQuery('#' + query);
    }
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
    <div className="min-h-screen pb-16 bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border">
        <div className="container px-4 h-16 flex items-center gap-2">
          <button
            className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search profiles and hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-16 h-12 text-lg bg-gray-100 dark:bg-gray-900 rounded-full"
              autoFocus
            />
            {/* Hashtag button */}
            <button
              className={`absolute right-12 top-2.5 h-7 w-7 flex items-center justify-center rounded-full ${query.startsWith('#') ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'} hover:bg-blue-200`}
              onClick={handleHashtagButton}
              type="button"
              aria-label="Search hashtags"
            >
              <Hash className="h-5 w-5" />
            </button>
            {query && (
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setQuery("")}
                type="button"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <div className="container px-4 py-2">
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

      {/* Results */}
      <div className="container px-4 pb-4 mt-2">
        {loading ? (
          <div className="text-center py-4">Searching...</div>
        ) : (
          <>
            {/* Profiles */}
            {!isHashtagSearch && results.profiles.length > 0 && (
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

      <BottomNavigation />
    </div>
  );
};

export default SearchPage; 