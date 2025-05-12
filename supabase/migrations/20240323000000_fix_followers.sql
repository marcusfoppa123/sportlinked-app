-- Drop existing triggers and function
DROP TRIGGER IF EXISTS update_follower_counts_after_insert ON public.followers;
DROP TRIGGER IF EXISTS update_follower_counts_after_delete ON public.followers;
DROP FUNCTION IF EXISTS update_follower_counts();

-- Create a function to recalculate follower counts
CREATE OR REPLACE FUNCTION recalculate_follower_counts(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Update following count
    UPDATE public.profiles
    SET following = (
        SELECT COUNT(*)
        FROM public.followers
        WHERE follower_id = user_id
    )
    WHERE id = user_id;

    -- Update followers count
    UPDATE public.profiles
    SET followers = (
        SELECT COUNT(*)
        FROM public.followers
        WHERE following_id = user_id
    )
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Recalculate counts for both users
        PERFORM recalculate_follower_counts(NEW.follower_id);
        PERFORM recalculate_follower_counts(NEW.following_id);
    ELSIF TG_OP = 'DELETE' THEN
        -- Recalculate counts for both users
        PERFORM recalculate_follower_counts(OLD.follower_id);
        PERFORM recalculate_follower_counts(OLD.following_id);
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

-- Create a function to recalculate all follower counts
CREATE OR REPLACE FUNCTION recalculate_all_follower_counts()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM public.profiles LOOP
        PERFORM recalculate_follower_counts(user_record.id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Recalculate all follower counts
SELECT recalculate_all_follower_counts(); 