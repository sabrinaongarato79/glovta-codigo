-- Ejecutar exclusivamente en glovta-evaluacion / yecgzorcxkokanuxgwki.
begin;
do $$
declare
  company_id uuid;
begin
  select id into strict company_id from auth.users
  where email = 'empresa.qa@example.com' and email_confirmed_at is not null;
  perform 1 from auth.users
  where email = 'candidata.qa@example.com' and email_confirmed_at is not null;
  if not found then
    raise exception 'Falta confirmar la cuenta candidata de evaluación.';
  end if;
  insert into public.employer_accounts(user_id, company_name)
  values (company_id, 'Glovta Empresa QA')
  on conflict (user_id) do nothing;
end $$;
commit;
select e.company_name, u.email
from public.employer_accounts e join auth.users u on u.id=e.user_id
where u.email='empresa.qa@example.com';

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname='public' order by tablename, policyname;
