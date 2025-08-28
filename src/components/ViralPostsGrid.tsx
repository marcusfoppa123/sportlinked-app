import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfilePostThumbnail from "./ProfilePostThumbnail";
import AnimatedLoadingScreen from "./AnimatedLoadingScreen";

interface ViralPost {
  id: string;
  image_url?: string;
  video_url?: string;
  user_id: string;
  created_at: string;
  content?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  bookmarkCount: number;
  viralScore: number;
}

const ViralPostsGrid: React.FC = () => {
  const [posts, setPosts] = useState<ViralPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViralPosts = async () => {
    setLoading(true);
    try {
      // Fetch posts with their interaction counts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          likes(count),
          comments(count),
          bookmarks(count)
        `)
        .order("created_at", { ascending: false })
        .limit(50); // Get recent posts to calculate virality from

      if (postsError) throw postsError;

      // Calculate viral scores and sort by virality
      const postsWithScores = (postsData || []).map((post: any) => {
        const likeCount = post.likes?.[0]?.count || 0;
        const commentCount = post.comments?.[0]?.count || 0;
        const shareCount = post.shares || 0;
        const bookmarkCount = post.bookmarks?.[0]?.count || 0;
        
        // Viral score algorithm: likes*1 + comments*2 + shares*3 + bookmarks*4
        const viralScore = likeCount * 1 + commentCount * 2 + shareCount * 3 + bookmarkCount * 4;
        
        return {
          ...post,
          likeCount,
          commentCount,
          shareCount,
          bookmarkCount,
          viralScore,
        };
      })
      .filter((post: ViralPost) => post.viralScore > 0) // Only show posts with interactions
      .sort((a: ViralPost, b: ViralPost) => b.viralScore - a.viralScore) // Sort by viral score descending
      .slice(0, 20); // Show top 20 viral posts

      setPosts(postsWithScores);
    } catch (err) {
      console.error('Error fetching viral posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViralPosts();
  }, []);

  if (loading) {
    return (
      <AnimatedLoadingScreen
        isLoading={loading}
        onComplete={() => {}}
      />
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No viral posts found yet.</p>
        <p className="text-sm mt-2">Posts with more interactions will appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Showing the most viral posts based on interactions
      </div>
      <div className="grid grid-cols-2 gap-1">
        {posts.map((post) => (
          <ProfilePostThumbnail
            key={post.id}
            post={{
              id: post.id,
              image_url: post.image_url,
              video_url: post.video_url,
              likeCount: post.likeCount,
            }}
            canDelete={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ViralPostsGrid;