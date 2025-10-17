import { supabase } from '../client';

export interface AthleteFilters {
  searchQuery?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  position?: string;
  dominantFoot?: string;
  division?: string;
  minYearsPlayed?: number;
  maxYearsPlayed?: number;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
}

export interface AthleteProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  role: string;
  sport?: string;
  athlete_position?: string;
  gender?: string;
  birth_year?: number;
  birth_month?: number;
  birth_day?: number;
  division?: string;
  years_played?: number;
  dominant_foot?: string;
  height?: number;
  weight?: number;
  location?: string;
  bio?: string;
}

export const searchAthletesWithFilters = async (filters: AthleteFilters): Promise<AthleteProfile[]> => {
  try {
  // @ts-ignore - RPC function types will be regenerated after migration
  const { data, error } = await supabase.rpc('search_athletes_with_filters', {
      p_search_query: filters.searchQuery || null,
      p_gender: filters.gender || null,
      p_min_age: filters.minAge || null,
      p_max_age: filters.maxAge || null,
      p_position: filters.position || null,
      p_dominant_foot: filters.dominantFoot || null,
      p_division: filters.division || null,
      p_min_years_played: filters.minYearsPlayed || null,
      p_max_years_played: filters.maxYearsPlayed || null,
      p_min_height: filters.minHeight || null,
      p_max_height: filters.maxHeight || null,
      p_min_weight: filters.minWeight || null,
      p_max_weight: filters.maxWeight || null,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching athletes:', error);
    throw error;
  }
};

export const checkIsScout = async (userId: string): Promise<boolean> => {
  try {
    // @ts-ignore - RPC function types will be regenerated after migration
    const { data, error } = await supabase.rpc('is_scout', { user_id: userId });
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error checking scout status:', error);
    return false;
  }
};
