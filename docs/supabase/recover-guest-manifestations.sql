-- Recover manifestations after guest → email sign-in split
--
-- What happened: magic link via signInWithOtp created a NEW auth user instead of
-- linking your guest (anonymous) session. Manifestations stayed on the old user_id.
--
-- Fix (run in Supabase SQL Editor):
-- 1. Find your email account id:
--    Authentication → Users → your email → copy User UID
-- 2. Find orphaned manifestations (Table Editor → manifestations) — note user_id on your posts
-- 3. Replace the UUIDs below and run:

-- UPDATE public.manifestations
-- SET user_id = 'YOUR-EMAIL-USER-UUID'
-- WHERE user_id = 'OLD-GUEST-USER-UUID';

-- If you also held manifestations as a guest:
-- UPDATE public.manifestation_joins
-- SET user_id = 'YOUR-EMAIL-USER-UUID'
-- WHERE user_id = 'OLD-GUEST-USER-UUID';

-- Optional: list manifestations by title to find the guest user_id
-- SELECT id, title, user_id, created_at FROM public.manifestations
-- WHERE title ILIKE '%part of your title%';

-- Optional: list auth users (requires service role or dashboard UI)
-- SELECT id, email, is_anonymous, created_at FROM auth.users ORDER BY created_at DESC;
