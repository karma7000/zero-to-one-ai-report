-- 고객이 "입금했어요"를 눌러 알려온 시각 (Supabase SQL Editor에서 실행)
alter table reports add column if not exists bank_transfer_claimed_at timestamptz;
