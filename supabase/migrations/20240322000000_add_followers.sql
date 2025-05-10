-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- Add RLS policies
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all followers"
    ON public.followers
    FOR SELECT
    USING (true);

CREATE POLICY "Users can follow other users"
    ON public.followers
    FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow other users"
    ON public.followers
    FOR DELETE
    USING (auth.uid() = follower_id);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE public.profiles
        SET following = COALESCE(following, 0) + 1
        WHERE id = NEW.follower_id;
        
        -- Increment followers count for followed user
        UPDATE public.profiles
        SET followers = COALESCE(followers, 0) + 1
        WHERE id = NEW.following_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE public.profiles
        SET following = GREATEST(COALESCE(following, 0) - 1, 0)
        WHERE id = OLD.follower_id;
        
        -- Decrement followers count for followed user
        UPDATE public.profiles
        SET followers = GREATEST(COALESCE(followers, 0) - 1, 0)
        WHERE id = OLD.following_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for follower count updates
CREATE TRIGGER update_follower_counts_after_insert
    AFTER INSERT ON public.followers
    FOR EACH ROW
    EXECUTE FUNCTION update_follower_counts();

CREATE TRIGGER update_follower_counts_after_delete
    AFTER DELETE ON public.followers
    FOR EACH ROW
    EXECUTE FUNCTION update_follower_counts(); 