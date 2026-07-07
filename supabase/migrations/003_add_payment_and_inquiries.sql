-- 결제 필드 추가 (Supabase SQL Editor에서 실행)
alter table reports add column if not exists payment_provider text;
alter table reports add column if not exists provider_payment_id text;
alter table reports add column if not exists amount_krw integer;
alter table reports add column if not exists paid_at timestamptz;

-- generation_started_at은 이제 결제 확인 시점에 설정되므로 not null 제약 해제
alter table reports alter column generation_started_at drop not null;

-- 신규 리포트 요청의 기본 상태를 결제 대기로 변경
alter table reports alter column status set default 'pending_payment';

-- 문의(CS/결제) 테이블
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id),
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;
