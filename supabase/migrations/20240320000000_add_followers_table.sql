-- Create followers table
create table if not exists public.followers (
    id uuid default gen_random_uuid() primary key,
    follower_id uuid references public.profiles(id) on delete cascade not null,
    following_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(follower_id, following_id)
);

-- Add RLS policies
alter table public.followers enable row level security;

create policy "Users can view their own followers"
    on public.followers for select
    using (auth.uid() = follower_id or auth.uid() = following_id);

create policy "Users can follow other users"
    on public.followers for insert
    with check (auth.uid() = follower_id);

create policy "Users can unfollow other users"
    on public.followers for delete
    using (auth.uid() = follower_id);

-- Add indexes
create index followers_follower_id_idx on public.followers(follower_id);
create index followers_following_id_idx on public.followers(following_id); 