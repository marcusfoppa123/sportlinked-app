
// Updating the searchProfilesAndHashtags function
export const searchProfilesAndHashtags = async (query: string) => {
  const searchTerm = query.toLowerCase();
  console.log('Performing search for:', searchTerm);
  
  try {
    // Search profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, role')
      .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      .limit(5);

    if (profilesError) {
      console.error('Profile search error:', profilesError);
      return { profiles: [], hashtags: [] };
    }
    
    console.log('Found profiles:', profiles?.length || 0);

    // Search posts for hashtags in the hashtags array column
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('hashtags')
      .not('hashtags', 'is', null)  // Only include posts with non-null hashtags
      .limit(50);  // Get more posts to find more unique hashtags

    if (postsError) {
      console.error('Hashtag search error:', postsError);
      return { profiles: profiles || [], hashtags: [] };
    }
    
    console.log('Searching through posts for hashtags:', posts?.length || 0);

    // Extract and filter unique hashtags from all posts
    const allHashtags = posts?.reduce((acc: string[], post) => {
      if (Array.isArray(post.hashtags)) {
        return [...acc, ...post.hashtags];
      }
      return acc;
    }, []) || [];
    
    // Filter hashtags that match the search term and make them unique
    const hashtags = Array.from(new Set(
      allHashtags.filter(tag => 
        tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
      )
    ));
    
    console.log('Found matching hashtags:', hashtags.length);
    console.log('Hashtags:', hashtags);

    return {
      profiles: profiles || [],
      hashtags: hashtags
    };
  } catch (err) {
    console.error('Exception in searchProfilesAndHashtags:', err);
    return { profiles: [], hashtags: [] };
  }
};
