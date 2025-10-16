import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Hash, User, X, Clock, ArrowLeft, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { searchProfilesAndHashtags, searchAthletesWithFilters, checkIsScout, AthleteFilters } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/context/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    profiles: any[];
    hashtags: string[];
  }>({ profiles: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isScout, setIsScout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AthleteFilters>({});
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);
  const { user } = useAuth();

  // Helper to determine if searching for hashtags only
  const isHashtagSearch = debouncedQuery.trim().startsWith('#');

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const checkScoutStatus = async () => {
      if (user?.id) {
        const scoutStatus = await checkIsScout(user.id);
        setIsScout(scoutStatus);
      }
    };
    checkScoutStatus();
  }, [user]);

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

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof AthleteFilters] !== undefined);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim() && !hasActiveFilters) {
        setResults({ profiles: [], hashtags: [] });
        return;
      }
      setLoading(true);
      try {
        // If scout with filters, use advanced search
        if (isScout && (hasActiveFilters || debouncedQuery)) {
          const athleteResults = await searchAthletesWithFilters({
            searchQuery: debouncedQuery || undefined,
            ...filters
          });
          setResults({
            profiles: athleteResults,
            hashtags: []
          });
        } else {
          // Regular search
          const searchTerm = isHashtagSearch ? debouncedQuery.slice(1) : debouncedQuery;
          const searchResults = await searchProfilesAndHashtags(searchTerm);
          setResults({
            profiles: isHashtagSearch ? [] : searchResults.profiles,
            hashtags: searchResults.hashtags
          });
        }
      } catch (error: any) {
        console.error('Search error:', error);
        if (error.message?.includes('Only scouts can use advanced filtering')) {
          toast.error('Advanced filtering is only available for scouts');
        }
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery, isHashtagSearch, isScout, hasActiveFilters, filters]);

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

  const calculateAge = (birthYear?: number) => {
    if (!birthYear) return null;
    return new Date().getFullYear() - birthYear;
  };

  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container px-4 h-16 flex items-center gap-2">
          <button
            className="mr-2 p-2 rounded-full hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={isScout ? "Search athletes..." : "Search profiles and hashtags..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-16 h-12 text-lg bg-muted rounded-full"
              autoFocus
            />
            {!isScout && (
              <button
                className={`absolute right-12 top-2.5 h-7 w-7 flex items-center justify-center rounded-full ${query.startsWith('#') ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'} hover:bg-primary/20`}
                onClick={handleHashtagButton}
                type="button"
                aria-label="Search hashtags"
              >
                <Hash className="h-5 w-5" />
              </button>
            )}
            {query && (
              <button
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
                type="button"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle for Scouts */}
        {isScout && (
          <div className="container px-4 py-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-2">Active</Badge>
                )}
              </span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </header>

      {/* Advanced Filters Panel */}
      {isScout && showFilters && (
        <div className="container px-4 py-4 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Age Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAge || ''}
                  onChange={(e) => setFilters({...filters, minAge: e.target.value ? parseInt(e.target.value) : undefined})}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAge || ''}
                  onChange={(e) => setFilters({...filters, maxAge: e.target.value ? parseInt(e.target.value) : undefined})}
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <Input
                placeholder="e.g., Forward, Midfielder"
                value={filters.position || ''}
                onChange={(e) => setFilters({...filters, position: e.target.value || undefined})}
              />
            </div>

            {/* Dominant Foot */}
            <div>
              <label className="text-sm font-medium mb-2 block">Dominant Foot</label>
              <Select value={filters.dominantFoot} onValueChange={(value) => setFilters({...filters, dominantFoot: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Division */}
            <div>
              <label className="text-sm font-medium mb-2 block">Division</label>
              <Input
                placeholder="e.g., Division 1, Division 2"
                value={filters.division || ''}
                onChange={(e) => setFilters({...filters, division: e.target.value || undefined})}
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="text-sm font-medium mb-2 block">Years Played</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minYearsPlayed || ''}
                  onChange={(e) => setFilters({...filters, minYearsPlayed: e.target.value ? parseInt(e.target.value) : undefined})}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYearsPlayed || ''}
                  onChange={(e) => setFilters({...filters, maxYearsPlayed: e.target.value ? parseInt(e.target.value) : undefined})}
                />
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="text-sm font-medium mb-2 block">Height (cm)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minHeight || ''}
                  onChange={(e) => setFilters({...filters, minHeight: e.target.value ? parseInt(e.target.value) : undefined})}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxHeight || ''}
                  onChange={(e) => setFilters({...filters, maxHeight: e.target.value ? parseInt(e.target.value) : undefined})}
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minWeight || ''}
                  onChange={(e) => setFilters({...filters, minWeight: e.target.value ? parseInt(e.target.value) : undefined})}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxWeight || ''}
                  onChange={(e) => setFilters({...filters, maxWeight: e.target.value ? parseInt(e.target.value) : undefined})}
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Non-Scout Message */}
      {!isScout && user && (
        <div className="container px-4 py-4 bg-muted/50 border-b border-border">
          <p className="text-sm text-muted-foreground text-center">
            Advanced filtering is only available for scouts
          </p>
        </div>
      )}

      {/* Recent Searches */}
      {!query && !hasActiveFilters && recentSearches.length > 0 && (
        <div className="container px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-muted-foreground">Recent Searches</span>
            <button
              className="text-xs text-primary hover:underline"
              onClick={clearRecentSearches}
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted text-left"
                onClick={() => handleRecentClick(search)}
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
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
                  {isScout ? 'Athletes' : 'Profiles'} ({results.profiles.length})
                </h3>
                <div className="space-y-2">
                  {results.profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer border border-border"
                      onClick={() => handleProfileClick(profile.id, profile.full_name)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold truncate">{profile.full_name}</span>
                          {profile.role && <Badge variant="secondary" className="text-xs">{profile.role}</Badge>}
                        </div>
                        {profile.username && (
                          <span className="text-sm text-muted-foreground block">@{profile.username}</span>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.athlete_position && (
                            <Badge variant="outline" className="text-xs">{profile.athlete_position}</Badge>
                          )}
                          {profile.sport && (
                            <Badge variant="outline" className="text-xs">{profile.sport}</Badge>
                          )}
                          {profile.birth_year && (
                            <Badge variant="outline" className="text-xs">Age: {calculateAge(profile.birth_year)}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {results.hashtags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Hashtags
                </h3>
                <div className="space-y-2">
                  {results.hashtags.map((hashtag) => (
                    <div
                      key={hashtag}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
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

            {!loading && (query || hasActiveFilters) && results.profiles.length === 0 && results.hashtags.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No results found</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters to see more results
                  </Button>
                )}
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
