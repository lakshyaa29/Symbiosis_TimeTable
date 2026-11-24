-- Safe to rerun: existing data is kept.
create table if not exists public.portal_state (
 id text primary key check(id='main'),
 sessions jsonb not null default '[]'::jsonb,
 activities jsonb not null default '[]'::jsonb,
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.portal_state enable row level security;
revoke all on public.portal_state from anon, authenticated;
grant select on public.portal_state to anon, authenticated;
grant all on public.portal_state to service_role;
drop policy if exists "Public portal reading" on public.portal_state;
create policy "Public portal reading" on public.portal_state for select to anon, authenticated using (true);
-- Small notifications avoid broadcasting the large timetable dataset.
create table if not exists public.portal_signal(id text primary key, revision bigint not null);
alter table public.portal_signal enable row level security;
revoke all on public.portal_signal from anon, authenticated;
grant select on public.portal_signal to anon, authenticated;
grant all on public.portal_signal to service_role;
drop policy if exists "Read update signals" on public.portal_signal;
create policy "Read update signals" on public.portal_signal for select to anon, authenticated using(true);
create or replace function public.notify_portal_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.portal_signal(id,revision) values(new.id,new.revision)
 on conflict(id) do update set revision=excluded.revision;
 return new;
end $$;
revoke all on function public.notify_portal_change() from public, anon, authenticated;
drop trigger if exists portal_update_signal on public.portal_state;
create trigger portal_update_signal after insert or update on public.portal_state for each row execute function public.notify_portal_change();
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='portal_signal') then
 alter publication supabase_realtime add table public.portal_signal;
 end if;
end $$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('timetables','timetables',true,2000000,array['application/pdf'])
on conflict(id) do nothing;
-- Public PDF downloads; no public upload/delete policy is granted.
create table if not exists public.portal_login_attempts (
 key text primary key, count integer not null, window_start timestamptz not null
);
alter table public.portal_login_attempts enable row level security;
revoke all on public.portal_login_attempts from anon, authenticated;
create or replace function public.consume_portal_login(attempt_key text) returns boolean
language plpgsql security definer set search_path='' as $$
declare attempts integer;
begin
 delete from public.portal_login_attempts where window_start < now()-interval '10 minutes';
 insert into public.portal_login_attempts(key,count,window_start) values(attempt_key,1,now())
 on conflict(key) do update set
 count=case when public.portal_login_attempts.window_start<now()-interval '5 minutes' then 1 else public.portal_login_attempts.count+1 end,
 window_start=case when public.portal_login_attempts.window_start<now()-interval '5 minutes' then now() else public.portal_login_attempts.window_start end
 returning count into attempts;
 return attempts<=8;
end $$;
revoke all on function public.consume_portal_login(text) from public, anon, authenticated;
grant execute on function public.consume_portal_login(text) to service_role;
