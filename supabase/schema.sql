-- ============================================================
-- STORYKEEPR — Supabase Schema Migration
-- Shared project: bmwpqxsdarevgaznslcz
-- Schema: storykeepr
-- ============================================================

-- 1. Create schema + permissions
CREATE SCHEMA IF NOT EXISTS storykeepr;

GRANT USAGE ON SCHEMA storykeepr TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storykeepr TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA storykeepr
  GRANT ALL ON TABLES TO anon, authenticated;

-- Expose to PostgREST (append storykeepr to existing list)
-- NOTE: Check current value first with: SHOW pgrst.db_schemas;
-- Then append storykeepr to the list
ALTER ROLE authenticator SET pgrst.db_schemas TO 'public,knowledgenook,reachout,magic_list,signature_style,storykeepr';
NOTIFY pgrst, 'reload config';


-- 2. RLS helper function (SECURITY DEFINER is critical!)
CREATE OR REPLACE FUNCTION storykeepr.user_team_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
$$;


-- 3. Stories table
CREATE TABLE storykeepr.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL REFERENCES public.teams(id),
  title text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  short_description text NOT NULL DEFAULT '',
  full_story_copy text NOT NULL DEFAULT '',

  -- Core 5H
  hope text NOT NULL DEFAULT '',
  hangup text NOT NULL DEFAULT '',
  handle text NOT NULL DEFAULT '',
  heart text NOT NULL DEFAULT '',
  hindsight text NOT NULL DEFAULT '',

  -- Bonus H's
  hook text,
  humor text,
  humility text,
  hidden_heroes text,
  humdrum text,
  headspace text,

  -- Audio
  audio_path text,

  -- Metadata
  tags text[] NOT NULL DEFAULT '{}',
  mood text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);


-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION storykeepr.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON storykeepr.stories
  FOR EACH ROW EXECUTE FUNCTION storykeepr.update_updated_at();


-- 5. RLS policies
ALTER TABLE storykeepr.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_access" ON storykeepr.stories
  FOR ALL
  USING (team_id IN (SELECT storykeepr.user_team_ids()));


-- 6. Storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('storykeepr-audio', 'storykeepr-audio', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storykeepr_audio_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'storykeepr-audio'
    AND (storage.foldername(name))[1] IN (SELECT storykeepr.user_team_ids()::text)
  );

CREATE POLICY "storykeepr_audio_read" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'storykeepr-audio'
    AND (storage.foldername(name))[1] IN (SELECT storykeepr.user_team_ids()::text)
  );

CREATE POLICY "storykeepr_audio_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'storykeepr-audio'
    AND (storage.foldername(name))[1] IN (SELECT storykeepr.user_team_ids()::text)
  );

CREATE POLICY "storykeepr_audio_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'storykeepr-audio'
    AND (storage.foldername(name))[1] IN (SELECT storykeepr.user_team_ids()::text)
  );


-- 7. Notify PostgREST to pick up new schema
NOTIFY pgrst, 'reload schema';
