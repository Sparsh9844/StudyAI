-- Supabase SQL Schema for StudyAI
-- Run this in the Supabase SQL Editor

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  revision_1 BOOLEAN DEFAULT FALSE,
  revision_2 BOOLEAN DEFAULT FALSE,
  revision_3 BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  total_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study plan days table
CREATE TABLE IF NOT EXISTS study_plan_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  subject TEXT NOT NULL,
  topics TEXT,
  hours DECIMAL(4,1) DEFAULT 2,
  focus_area TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revisions table
CREATE TABLE IF NOT EXISTS revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  revision_number INTEGER CHECK (revision_number IN (1, 2, 3)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revision items table
CREATE TABLE IF NOT EXISTS revision_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  revision_id UUID REFERENCES revisions(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own subjects"
  ON subjects FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own topics"
  ON topics FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own study plans"
  ON study_plans FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own study plan days"
  ON study_plan_days FOR ALL USING (
    study_plan_id IN (SELECT id FROM study_plans WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own revisions"
  ON revisions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own revision items"
  ON revision_items FOR ALL USING (
    revision_id IN (SELECT id FROM revisions WHERE user_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_user ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_revisions_user ON revisions(user_id);
