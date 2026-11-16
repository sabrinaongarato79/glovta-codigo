begin;
-- Solo para glovta-evaluacion: yecgzorcxkokanuxgwki. Ejecutar en el SQL Editor de ese proyecto.
do $$ begin
  if exists (select 1 from pg_tables where schemaname='public') then
    raise exception 'Se esperaba un esquema public sin tablas. Revisar antes de continuar.';
  end if;
end $$;
-- 202609300001_mvp_core.sql
-- Initial schema for a NEW Supabase project. Not yet executed remotely.
-- Sources: https://supabase.com/docs/guides/database/postgres/row-level-security
-- No demo vacancies or user records are inserted.

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


-- 202611050001_professional_profile.sql
-- Glovta: ampliación del perfil. Pendiente de ejecutar en Supabase.
-- Ejecutar una vez. BEGIN/COMMIT evita aplicar una parte si ocurre un error.

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

-- 202611060001_employer_workflow.sql
-- Provision employer_accounts through trusted administration in the approved environment.

create table public.employer_accounts (
  user_id uuid primary key references auth.users(id),
  company_name text not null check (length(trim(company_name)) between 1 and 200)
);
alter table public.employer_accounts enable row level security;
revoke all on public.employer_accounts from public, anon, authenticated;
grant select on public.employer_accounts to authenticated;
create policy employer_self on public.employer_accounts for select to authenticated
  using (user_id = (select auth.uid()));

alter table public.opportunities add column employer_id uuid references public.employer_accounts(user_id);
create index opportunities_employer_idx on public.opportunities(employer_id);
grant insert (employer_id, company_name, title, description, location, status) on public.opportunities to authenticated;
create policy employer_publish on public.opportunities for insert to authenticated with check (
  employer_id = (select auth.uid()) and status = 'published'
  and exists (select 1 from public.employer_accounts e where e.user_id = employer_id
    and e.company_name = opportunities.company_name)
);
create policy employer_own_offers on public.opportunities for select to authenticated
  using (employer_id = (select auth.uid()));

create policy employer_read_applications on public.applications for select to authenticated
  using (exists (select 1 from public.opportunities o where o.id = opportunity_id and o.employer_id = (select auth.uid())));
grant update (status) on public.applications to authenticated;
create policy employer_review_applications on public.applications for update to authenticated
  using (exists (select 1 from public.opportunities o where o.id = opportunity_id and o.employer_id = (select auth.uid())))
  with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and o.employer_id = (select auth.uid())));

create function public.check_application_transition() returns trigger language plpgsql set search_path = '' as $$
begin
  if not ((old.status = 'submitted' and new.status = 'reviewing')
       or (old.status = 'reviewing' and new.status in ('accepted','rejected'))) then
    raise exception 'Invalid application transition' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger check_application_transition before update of status on public.applications
  for each row execute function public.check_application_transition();

commit;
select tablename as tabla, rowsecurity as rls_activa from pg_tables where schemaname='public' order by tablename;
