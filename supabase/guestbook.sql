-- Guestbook table for the wedding site. 
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 60),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

-- Visitors can only ADD a wish. Wishes are private: nobody can read, edit or delete them
-- through the public key — read them in the Supabase dashboard (Table Editor).
drop policy if exists "guestbook read" on public.guestbook;

create policy "guestbook insert" on public.guestbook
  for insert to anon with check (true);
