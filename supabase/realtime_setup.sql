-- Run this in Supabase SQL editor once for realtime bookmark sync.

create extension if not exists pgcrypto;

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookmarks_user_id_created_at_idx
  on public.bookmarks (user_id, created_at desc);

alter table public.bookmarks enable row level security;
alter table public.bookmarks replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'bookmarks_select_own'
  ) then
    create policy bookmarks_select_own
      on public.bookmarks for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'bookmarks_insert_own'
  ) then
    create policy bookmarks_insert_own
      on public.bookmarks for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'bookmarks_update_own'
  ) then
    create policy bookmarks_update_own
      on public.bookmarks for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'bookmarks_delete_own'
  ) then
    create policy bookmarks_delete_own
      on public.bookmarks for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bookmarks'
  ) then
    alter publication supabase_realtime add table public.bookmarks;
  end if;
end $$;
