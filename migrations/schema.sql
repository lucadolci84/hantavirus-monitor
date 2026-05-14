-- HantaWatch Neon/Postgres schema
-- Run this file once in the Neon SQL Editor.

create table if not exists sources (
  id text primary key,
  name text not null,
  type text not null,
  coverage text,
  url text,
  reliability text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monitor_snapshots (
  id bigserial primary key,
  year integer not null,
  generated_at timestamptz not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists monitor_snapshots_year_generated_idx
  on monitor_snapshots (year, generated_at desc);

create table if not exists country_metrics (
  id bigserial primary key,
  metric_hash text unique not null,
  country_iso2 text not null,
  country_name text,
  region text,
  metric_type text not null,
  metric_year integer,
  metric_week integer,
  value numeric,
  rate numeric,
  source_id text references sources(id) on delete set null,
  source_url text,
  observed_at timestamptz not null default now(),
  raw jsonb
);

create index if not exists country_metrics_country_idx
  on country_metrics (country_iso2);

create index if not exists country_metrics_type_year_idx
  on country_metrics (metric_type, metric_year);

create table if not exists events (
  id text primary key,
  title text not null,
  disease text,
  status text,
  scope text,
  started_at date,
  last_updated_at date,
  source_url text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_updates (
  id bigserial primary key,
  event_id text references events(id) on delete cascade,
  update_date date,
  cases_total integer,
  confirmed integer,
  probable integer,
  deaths integer,
  summary text,
  source_id text references sources(id) on delete set null,
  source_url text,
  raw jsonb,
  created_at timestamptz not null default now(),
  unique(event_id, update_date, source_url)
);

create table if not exists signals (
  id bigserial primary key,
  title text not null,
  url text unique,
  source text,
  country_iso2 text,
  country_name text,
  kind text,
  published_at timestamptz,
  raw jsonb,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signals_country_idx
  on signals (country_iso2);

create index if not exists signals_published_idx
  on signals (published_at desc);

create table if not exists fetch_logs (
  id bigserial primary key,
  source_id text,
  status text not null,
  message text,
  fetched_at timestamptz not null default now()
);
