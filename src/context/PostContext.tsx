import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  user_id: string;
  sport: string | null;
  hashtags: string[];
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    role: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  userLiked: boolean;
  userBookmarked: boolean;
}

interface PostContextType {
  posts: Post[];
  loading: boolean;
  fetchPosts: (userId?: string, sport?: string) => Promise<void>;
  fetchSavedPosts: (userId?: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  unbookmarkPost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchPosts = useCallback(async (userId?: string, sport?: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          user:profiles(id, name, avatar_url, role),
          likes:post_likes(count),
          comments:post_comments(count),
          shares:post_shares(count),
          user_likes:post_likes(user_id),
          user_bookmarks:post_bookmarks(user_id)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (sport) {
        query = query.eq('sport', sport);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedPosts = data.map((post: any) => ({
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        video_url: post.video_url,
        created_at: post.created_at,
        user_id: post.user_id,
        sport: post.sport,
        hashtags: post.hashtags || [],
        user: {
          id: post.user.id,
          name: post.user.name,
          avatar_url: post.user.avatar_url,
          role: post.user.role
        },
        stats: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0,
          shares: post.shares?.[0]?.count || 0
        },
        userLiked: post.user_likes?.some((like: any) => like.user_id === user.id) || false,
        userBookmarked: post.user_bookmarks?.some((bookmark: any) => bookmark.user_id === user.id) || false
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchSavedPosts = useCallback(async (userId?: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('post_bookmarks')
        .select(`
          post:posts(
            *,
            user:profiles(id, name, avatar_url, role),
            likes:post_likes(count),
            comments:post_comments(count),
            shares:post_shares(count),
            user_likes:post_likes(user_id),
            user_bookmarks:post_bookmarks(user_id)
          )
        `)
        .eq('user_id', userId || user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data.map((bookmark: any) => ({
        id: bookmark.post.id,
        content: bookmark.post.content,
        image_url: bookmark.post.image_url,
        video_url: bookmark.post.video_url,
        created_at: bookmark.post.created_at,
        user_id: bookmark.post.user_id,
        sport: bookmark.post.sport,
        hashtags: bookmark.post.hashtags || [],
        user: {
          id: bookmark.post.user.id,
          name: bookmark.post.user.name,
          avatar_url: bookmark.post.user.avatar_url,
          role: bookmark.post.user.role
        },
        stats: {
          likes: bookmark.post.likes?.[0]?.count || 0,
          comments: bookmark.post.comments?.[0]?.count || 0,
          shares: bookmark.post.shares?.[0]?.count || 0
        },
        userLiked: bookmark.post.user_likes?.some((like: any) => like.user_id === user.id) || false,
        userBookmarked: bookmark.post.user_bookmarks?.some((bookmark: any) => bookmark.user_id === user.id) || false
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshPosts = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                stats: { ...post.stats, likes: post.stats.likes + 1 },
                userLiked: true
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  }, [user?.id]);

  const unlikePost = useCallback(async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (error) throw error;

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                stats: { ...post.stats, likes: post.stats.likes - 1 },
                userLiked: false
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error unliking post:', error);
      toast.error('Failed to unlike post');
    }
  }, [user?.id]);

  const bookmarkPost = useCallback(async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('post_bookmarks')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, userBookmarked: true }
            : post
        )
      );
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Failed to bookmark post');
    }
  }, [user?.id]);

  const unbookmarkPost = useCallback(async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('post_bookmarks')
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (error) throw error;

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, userBookmarked: false }
            : post
        )
      );
    } catch (error) {
      console.error('Error unbookmarking post:', error);
      toast.error('Failed to unbookmark post');
    }
  }, [user?.id]);

  const deletePost = useCallback(async (postId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: postId, user_id: user.id });

      if (error) throw error;

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  }, [user?.id]);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        fetchSavedPosts,
        refreshPosts,
        likePost,
        unlikePost,
        bookmarkPost,
        unbookmarkPost,
        deletePost
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}; 