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

-- Preferred app path: SECURITY DEFINER RPC (works even if DELETE policy was missed).
create or replace function public.withdraw_manifestation_hold(p_manifestation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_deleted int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.manifestation_joins
  where manifestation_id = p_manifestation_id
    and user_id = v_user_id;

  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'You are not holding this manifestation';
  end if;
end;
$$;

grant execute on function public.withdraw_manifestation_hold(uuid) to anon, authenticated;
