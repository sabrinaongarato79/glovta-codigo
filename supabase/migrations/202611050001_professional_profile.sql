-- Glovta: ampliación del perfil. Pendiente de ejecutar en Supabase.
-- Ejecutar una vez. BEGIN/COMMIT evita aplicar una parte si ocurre un error.
begin;

alter table public.profiles
  add column career_goal text not null default '' check (char_length(career_goal) <= 1000),
  add column work_mode text not null default '' check (work_mode in ('', 'remote', 'hybrid', 'onsite', 'flexible')),
  add column work_schedule text not null default '' check (work_schedule in ('', 'full_time', 'part_time', 'flexible')),
  add column sectors text not null default '' check (char_length(sectors) <= 500),
  add column opportunity_types text not null default '' check (char_length(opportunity_types) <= 500);

grant update (career_goal, work_mode, work_schedule, sectors, opportunity_types)
  on public.profiles to authenticated;

create table public.profile_experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position text not null check (char_length(trim(position)) between 1 and 150),
  organization text not null check (char_length(trim(organization)) between 1 and 200),
  experience_type text not null default 'employment'
    check (experience_type in ('employment', 'freelance', 'academic', 'volunteer', 'personal')),
  start_date date,
  end_date date,
  is_current boolean not null default false,
  achievements text not null default '' check (char_length(achievements) <= 3000),
  created_at timestamptz not null default now(),
  check (end_date is null or (start_date is not null and end_date >= start_date)),
  check (not is_current or end_date is null)
);

create table public.profile_education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  institution text not null check (char_length(trim(institution)) between 1 and 200),
  education_type text not null default 'academic'
    check (education_type in ('academic', 'certification', 'course', 'training')),
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '' check (char_length(description) <= 2000),
  created_at timestamptz not null default now(),
  check (end_date is null or (start_date is not null and end_date >= start_date)),
  check (not is_current or end_date is null)
);

create table public.profile_languages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  language text not null check (char_length(trim(language)) between 1 and 80),
  proficiency text not null check (proficiency in ('basic', 'intermediate', 'advanced', 'native')),
  created_at timestamptz not null default now()
);
create unique index profile_languages_unique
  on public.profile_languages(profile_id, lower(trim(language)));

create table public.profile_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  category text not null check (category in ('technical', 'interpersonal', 'digital')),
  created_at timestamptz not null default now()
);
create unique index profile_skills_unique
  on public.profile_skills(profile_id, lower(trim(name)));

create index profile_experiences_owner_idx on public.profile_experiences(profile_id);
alter table public.profile_experiences enable row level security;
revoke all on public.profile_experiences from anon, authenticated;
grant select, delete on public.profile_experiences to authenticated;
grant insert (profile_id, position, organization, experience_type, start_date, end_date, is_current, achievements) on public.profile_experiences to authenticated;
grant update (position, organization, experience_type, start_date, end_date, is_current, achievements) on public.profile_experiences to authenticated;

create policy profile_experiences_read on public.profile_experiences
  for select to authenticated using ((select auth.uid()) = profile_id);
create policy profile_experiences_insert on public.profile_experiences
  for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy profile_experiences_update on public.profile_experiences
  for update to authenticated using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);
create policy profile_experiences_delete on public.profile_experiences
  for delete to authenticated using ((select auth.uid()) = profile_id);

create index profile_languages_owner_idx on public.profile_languages(profile_id);
alter table public.profile_languages enable row level security;
revoke all on public.profile_languages from anon, authenticated;
grant select, delete on public.profile_languages to authenticated;
grant insert (profile_id, language, proficiency) on public.profile_languages to authenticated;
grant update (language, proficiency) on public.profile_languages to authenticated;

create policy profile_languages_read on public.profile_languages
  for select to authenticated using ((select auth.uid()) = profile_id);
create policy profile_languages_insert on public.profile_languages
  for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy profile_languages_update on public.profile_languages
  for update to authenticated using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);
create policy profile_languages_delete on public.profile_languages
  for delete to authenticated using ((select auth.uid()) = profile_id);

create index profile_skills_owner_idx on public.profile_skills(profile_id);
alter table public.profile_skills enable row level security;
revoke all on public.profile_skills from anon, authenticated;
grant select, delete on public.profile_skills to authenticated;
grant insert (profile_id, name, category) on public.profile_skills to authenticated;
grant update (name, category) on public.profile_skills to authenticated;

create policy profile_skills_read on public.profile_skills
  for select to authenticated using ((select auth.uid()) = profile_id);
create policy profile_skills_insert on public.profile_skills
  for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy profile_skills_update on public.profile_skills
  for update to authenticated using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);
create policy profile_skills_delete on public.profile_skills
  for delete to authenticated using ((select auth.uid()) = profile_id);

create index profile_education_owner_idx on public.profile_education(profile_id);
alter table public.profile_education enable row level security;
revoke all on public.profile_education from anon, authenticated;
grant select, delete on public.profile_education to authenticated;
grant insert (profile_id, title, institution, education_type, start_date, end_date, is_current, description) on public.profile_education to authenticated;
grant update (title, institution, education_type, start_date, end_date, is_current, description) on public.profile_education to authenticated;

create policy profile_education_read on public.profile_education
  for select to authenticated using ((select auth.uid()) = profile_id);
create policy profile_education_insert on public.profile_education
  for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy profile_education_update on public.profile_education
  for update to authenticated using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);
create policy profile_education_delete on public.profile_education
  for delete to authenticated using ((select auth.uid()) = profile_id);
commit;
