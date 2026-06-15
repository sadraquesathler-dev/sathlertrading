create extension if not exists "pgcrypto";

create table if not exists public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month integer not null check (month between 1 and 12),
  year integer not null check (year >= 2000),
  target_value numeric(14, 2) not null check (target_value >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, month, year)
);

create table if not exists public.trade_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_date date not null,
  result_value numeric(14, 2) not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, trade_date)
);

alter table public.monthly_goals enable row level security;
alter table public.trade_results enable row level security;

create policy "monthly_goals_select_own" on public.monthly_goals
  for select using (auth.uid() = user_id);

create policy "monthly_goals_insert_own" on public.monthly_goals
  for insert with check (auth.uid() = user_id);

create policy "monthly_goals_update_own" on public.monthly_goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "monthly_goals_delete_own" on public.monthly_goals
  for delete using (auth.uid() = user_id);

create policy "trade_results_select_own" on public.trade_results
  for select using (auth.uid() = user_id);

create policy "trade_results_insert_own" on public.trade_results
  for insert with check (auth.uid() = user_id);

create policy "trade_results_update_own" on public.trade_results
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "trade_results_delete_own" on public.trade_results
  for delete using (auth.uid() = user_id);

create index if not exists monthly_goals_user_month_year_idx on public.monthly_goals(user_id, year, month);
create index if not exists trade_results_user_date_idx on public.trade_results(user_id, trade_date);
