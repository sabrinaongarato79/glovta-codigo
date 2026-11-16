-- Initial schema for a NEW Supabase project. Not yet executed remotely.
-- Sources: https://supabase.com/docs/guides/database/postgres/row-level-security
-- No demo vacancies or user records are inserted.
begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 150),
  headline text not null default '' check (char_length(headline) <= 200),
  location text not null default '' check (char_length(location) <= 150),
  bio text not null default '' check (char_length(bio) <= 3000),
  created_at timestamptz not null default now()
);

-- Publishing is initially reserved for trusted administration.
-- Company onboarding and verified membership policies are a later migration.
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 200),
  company_name text not null check (char_length(trim(company_name)) between 1 and 200),
  description text not null check (char_length(trim(description)) between 1 and 10000),
  location text not null default '' check (char_length(location) <= 200),
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id),
  cover_note text not null default '' check (char_length(cover_note) <= 3000),
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (candidate_id, opportunity_id)
);
create index applications_opportunity_idx on public.applications(opportunity_id);

alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;

revoke all on public.profiles, public.opportunities, public.applications from anon, authenticated;
grant select, insert on public.profiles to authenticated;
grant update (full_name, headline, location, bio) on public.profiles to authenticated;
grant select on public.opportunities to anon, authenticated;
grant select on public.applications to authenticated;
grant insert (candidate_id, opportunity_id, cover_note) on public.applications to authenticated;

create policy profiles_read_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy profiles_create_own on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy profiles_edit_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy opportunities_public_read on public.opportunities for select to anon, authenticated
  using (status = 'published' and (closes_at is null or closes_at > now()));
create policy applications_read_own on public.applications for select to authenticated
  using ((select auth.uid()) = candidate_id);
create policy applications_submit_own on public.applications for insert to authenticated
  with check (
    (select auth.uid()) = candidate_id
    and status = 'submitted'
    and exists (
      select 1 from public.opportunities o
      where o.id = opportunity_id and o.status = 'published'
        and (o.closes_at is null or o.closes_at > now())
    )
  );

commit;
