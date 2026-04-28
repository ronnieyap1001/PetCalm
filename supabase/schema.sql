-- PetCalm Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  species text not null check (species in ('dog', 'cat')),
  pet_name text not null,
  breed text,
  age_range text,
  weight_range text,
  living text,
  household text[],
  owned_for text,
  rescued text,

  answers jsonb,
  dimension_scores jsonb,
  overall_score int,
  profile_type text,
  secondary_profile_type text,
  is_storm boolean default false,

  status text not null default 'in_progress',
  completed_at timestamptz,

  paid boolean default false,
  paid_amount_cents int,
  paid_at timestamptz,
  payment_provider text,
  stripe_session_id text,
  ab_cohort text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists assessments_user_id_idx on public.assessments(user_id);
create index if not exists assessments_status_idx on public.assessments(status);

-- Update timestamp trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assessments_set_updated_at on public.assessments;
create trigger assessments_set_updated_at
before update on public.assessments
for each row execute function public.set_updated_at();

-- Row level security
alter table public.assessments enable row level security;

drop policy if exists "Users can view their own assessments" on public.assessments;
create policy "Users can view their own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own assessments" on public.assessments;
create policy "Users can insert their own assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own assessments" on public.assessments;
create policy "Users can update their own assessments"
  on public.assessments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
