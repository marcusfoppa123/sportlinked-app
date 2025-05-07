-- Create message_requests table
CREATE TABLE IF NOT EXISTS public.message_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(sender_id, receiver_id)
);

-- Add RLS policies
ALTER TABLE public.message_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own message requests"
    ON public.message_requests
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create message requests"
    ON public.message_requests
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own message requests"
    ON public.message_requests
    FOR UPDATE
    USING (auth.uid() = receiver_id);

-- Create function to check message request limit
CREATE OR REPLACE FUNCTION check_message_request_limit()
RETURNS TRIGGER AS $$
DECLARE
    request_count INTEGER;
BEGIN
    -- Count pending requests in the last 24 hours
    SELECT COUNT(*)
    INTO request_count
    FROM public.message_requests
    WHERE sender_id = NEW.sender_id
    AND created_at > NOW() - INTERVAL '24 hours'
    AND status = 'pending';

    -- If limit exceeded, raise exception
    IF request_count >= 5 THEN
        RAISE EXCEPTION 'Message request limit exceeded. Please try again later.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for message request limit
CREATE TRIGGER enforce_message_request_limit
    BEFORE INSERT ON public.message_requests
    FOR EACH ROW
    EXECUTE FUNCTION check_message_request_limit(); 