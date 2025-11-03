/*
  # Mind Frame Database Schema

  1. New Tables
    - `user_profile` - User profile and preferences
    - `daily_reflection` - Daily journal entries
    - `weekly_reflection` - Weekly recalibration entries
    - `morning_reflection` - Morning embodiment entries
    - `identity_rep` - Core identity representations
    - `vision_board` - Vision board items
    - `embodiment_mirror` - Embodiment mirror sessions
    - `goal_action_session` - Goal action generation sessions
    - `seven_layers_session` - Seven layers deep sessions
    - `journal_entry` - Daily journal entries
    - `alchemist_forge_session` - Alchemist forge sessions
    - `flow_command_session` - Flow command sessions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access control
    - Each user can only access their own data
*/

CREATE TABLE IF NOT EXISTS user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_name text,
  identity_summary text,
  life_purpose_summary text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'weekly', 'monthly', 'yearly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_reflection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  content text,
  mood text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS weekly_reflection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  reflection_content text,
  key_learnings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS morning_reflection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  intention text,
  frequency_setting text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS identity_rep (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  identity_level text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vision_board (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  image_url text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS embodiment_mirror (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  reflection_content text,
  physical_state text,
  emotional_state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goal_action_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal text NOT NULL,
  actions jsonb,
  core_identity text,
  emotional_state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seven_layers_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  layers jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS journal_entry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  title text,
  content text NOT NULL,
  prompt text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alchemist_forge_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge text NOT NULL,
  transmutation jsonb,
  wisdom text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flow_command_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflection ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflection ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_reflection ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_rep ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE embodiment_mirror ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_action_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE seven_layers_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE alchemist_forge_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_command_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profile
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profile
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profile
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reflections" ON daily_reflection
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reflections" ON daily_reflection
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections" ON daily_reflection
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections" ON daily_reflection
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly reflections" ON weekly_reflection
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create weekly reflections" ON weekly_reflection
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly reflections" ON weekly_reflection
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own morning reflections" ON morning_reflection
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create morning reflections" ON morning_reflection
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own morning reflections" ON morning_reflection
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own identity reps" ON identity_rep
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create identity reps" ON identity_rep
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identity reps" ON identity_rep
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own vision board" ON vision_board
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create vision items" ON vision_board
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision items" ON vision_board
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own embodiment mirrors" ON embodiment_mirror
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create embodiment mirrors" ON embodiment_mirror
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own embodiment mirrors" ON embodiment_mirror
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own goal sessions" ON goal_action_session
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create goal sessions" ON goal_action_session
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own seven layers sessions" ON seven_layers_session
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create seven layers sessions" ON seven_layers_session
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own journal entries" ON journal_entry
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create journal entries" ON journal_entry
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entry
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own alchemist sessions" ON alchemist_forge_session
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create alchemist sessions" ON alchemist_forge_session
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own flow command sessions" ON flow_command_session
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create flow command sessions" ON flow_command_session
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_profile_user_id ON user_profile(user_id);
CREATE INDEX idx_daily_reflection_user_id ON daily_reflection(user_id, date);
CREATE INDEX idx_weekly_reflection_user_id ON weekly_reflection(user_id, week_start_date);
CREATE INDEX idx_morning_reflection_user_id ON morning_reflection(user_id, date);
CREATE INDEX idx_identity_rep_user_id ON identity_rep(user_id);
CREATE INDEX idx_vision_board_user_id ON vision_board(user_id);
CREATE INDEX idx_embodiment_mirror_user_id ON embodiment_mirror(user_id, date);
CREATE INDEX idx_goal_action_user_id ON goal_action_session(user_id);
CREATE INDEX idx_seven_layers_user_id ON seven_layers_session(user_id);
CREATE INDEX idx_journal_entry_user_id ON journal_entry(user_id, date);
CREATE INDEX idx_alchemist_forge_user_id ON alchemist_forge_session(user_id);
CREATE INDEX idx_flow_command_user_id ON flow_command_session(user_id);
