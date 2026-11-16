-- Provision employer_accounts through trusted administration in the approved environment.
begin;
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
