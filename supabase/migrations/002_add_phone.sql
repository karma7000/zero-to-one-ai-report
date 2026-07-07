-- 기존 reports 테이블에 phone 컬럼 추가 (Supabase SQL Editor에서 실행)
alter table reports add column if not exists phone text not null default '';
alter table reports alter column phone drop default;
