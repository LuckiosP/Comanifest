-- Phase 3b — withdraw hold (delete own join row; decrement join_count)
-- Run once in Supabase SQL Editor if you already have manifestation_joins from an earlier migration.

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'manifestation_joins'
      and policyname = 'Users can delete their own joins'
  ) then
    create policy "Users can delete their own joins"
      on public.manifestation_joins
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

create or replace function public.manifestation_joins_after_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.manifestations
  set join_count = greatest(1, join_count - 1)
  where id = old.manifestation_id;
  return old;
end;
$$;

drop trigger if exists manifestation_joins_decrement_count on public.manifestation_joins;

create trigger manifestation_joins_decrement_count
  after delete on public.manifestation_joins
  for each row
  execute function public.manifestation_joins_after_delete();
