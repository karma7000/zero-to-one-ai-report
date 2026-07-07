-- Supabase SQL editor에서 실행하세요.
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending_payment', -- 'pending_payment' | 'generating' | 'completed' | 'failed'
  company_name text not null,
  email text not null,
  phone text not null,
  target_country text not null,
  product_description text not null,
  report_json jsonb,
  model_used text,
  payment_provider text, -- 'toss'
  provider_payment_id text, -- toss paymentKey
  amount_krw integer,
  paid_at timestamptz,
  generation_started_at timestamptz,
  generation_completed_at timestamptz,
  generation_error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reports_email_created on reports(email, created_at);
create index if not exists idx_reports_status on reports(status);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id),
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);
