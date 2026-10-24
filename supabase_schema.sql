-- ============================================================
-- StudyAI – Complete Supabase Schema
-- Run this entire file in your Supabase SQL Editor:
--   https://supabase.com/dashboard → your project → SQL Editor → New query
-- ============================================================

-- ── 1. subjects ──────────────────────────────────────────────
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  exam_date   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row-Level Security: every user sees only their own rows
alter table public.subjects enable row level security;

create policy "subjects: select own"   on public.subjects for select using (auth.uid() = user_id);
create policy "subjects: insert own"   on public.subjects for insert with check (auth.uid() = user_id);
create policy "subjects: update own"   on public.subjects for update using (auth.uid() = user_id);
create policy "subjects: delete own"   on public.subjects for delete using (auth.uid() = user_id);


-- ── 2. topics ────────────────────────────────────────────────
create table if not exists public.topics (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  name        text not null,
  description text,
  status      text not null default 'pending'
                check (status in ('pending', 'in_progress', 'completed')),
  revision_1  boolean not null default false,
  revision_2  boolean not null default false,
  revision_3  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.topics enable row level security;

create policy "topics: select own"   on public.topics for select using (auth.uid() = user_id);
create policy "topics: insert own"   on public.topics for insert with check (auth.uid() = user_id);
create policy "topics: update own"   on public.topics for update using (auth.uid() = user_id);
create policy "topics: delete own"   on public.topics for delete using (auth.uid() = user_id);


-- ── 3. study_plans ───────────────────────────────────────────
create table if not exists public.study_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  total_days  integer not null default 30,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.study_plans enable row level security;

create policy "study_plans: select own"   on public.study_plans for select using (auth.uid() = user_id);
create policy "study_plans: insert own"   on public.study_plans for insert with check (auth.uid() = user_id);
create policy "study_plans: update own"   on public.study_plans for update using (auth.uid() = user_id);
create policy "study_plans: delete own"   on public.study_plans for delete using (auth.uid() = user_id);


-- ── 4. study_plan_days ───────────────────────────────────────
create table if not exists public.study_plan_days (
  id              uuid primary key default gen_random_uuid(),
  study_plan_id   uuid not null references public.study_plans(id) on delete cascade,
  day_number      integer not null,
  date            date,
  subject         text not null,
  topics          text,
  hours           integer not null default 2,
  focus_area      text,
  created_at      timestamptz not null default now()
);

alter table public.study_plan_days enable row level security;

-- study_plan_days are accessed by joining through study_plans, so RLS
-- checks ownership via the parent plan's user_id.
create policy "study_plan_days: select own" on public.study_plan_days
  for select using (
    exists (
      select 1 from public.study_plans sp
      where sp.id = study_plan_id and sp.user_id = auth.uid()
    )
  );

create policy "study_plan_days: insert own" on public.study_plan_days
  for insert with check (
    exists (
      select 1 from public.study_plans sp
      where sp.id = study_plan_id and sp.user_id = auth.uid()
    )
  );

create policy "study_plan_days: delete own" on public.study_plan_days
  for delete using (
    exists (
      select 1 from public.study_plans sp
      where sp.id = study_plan_id and sp.user_id = auth.uid()
    )
  );


-- ── 5. Useful indexes ────────────────────────────────────────
create index if not exists idx_subjects_user_id    on public.subjects(user_id);
create index if not exists idx_topics_user_id      on public.topics(user_id);
create index if not exists idx_topics_subject_id   on public.topics(subject_id);
create index if not exists idx_study_plans_user_id on public.study_plans(user_id);
create index if not exists idx_plan_days_plan_id   on public.study_plan_days(study_plan_id);


-- ── 6. auto-update updated_at ────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_subjects_updated_at
  before update on public.subjects
  for each row execute procedure public.handle_updated_at();

create trigger trg_topics_updated_at
  before update on public.topics
  for each row execute procedure public.handle_updated_at();

create trigger trg_study_plans_updated_at
  before update on public.study_plans
  for each row execute procedure public.handle_updated_at();
