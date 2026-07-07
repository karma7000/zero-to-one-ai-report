import { getSupabaseServerClient } from "./supabase/server";

const LIMIT_PER_DAY = Number(process.env.RATE_LIMIT_PER_EMAIL_PER_DAY || 1);

export async function isRateLimited(email: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  if (error) {
    throw new Error(`레이트리밋 조회 실패: ${error.message}`);
  }

  return (count ?? 0) >= LIMIT_PER_DAY;
}
