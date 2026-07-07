import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cream/40 px-6 py-16">
        <p className="text-red-600">권한이 없습니다.</p>
      </div>
    );
  }

  const supabase = getSupabaseServerClient();
  const { data: orders } = await supabase
    .from("reports")
    .select(
      "id, company_name, target_country, amount_krw, email, phone, created_at, bank_transfer_claimed_at"
    )
    .eq("status", "pending_payment")
    .order("bank_transfer_claimed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const redirectTo = `/admin/reports?secret=${encodeURIComponent(secret)}`;

  return (
    <div className="flex flex-1 flex-col gap-6 bg-cream/40 px-6 py-16">
      <h1 className="text-xl font-extrabold text-dark-text">
        결제 대기중인 주문 ({orders?.length ?? 0}건)
      </h1>
      <p className="text-sm text-mute-text">
        계좌이체 입금을 은행 앱으로 직접 확인한 뒤에만 승인 버튼을 눌러주세요.
        승인 즉시 AI 리포트 생성(과금)이 시작됩니다.
      </p>

      <div className="flex flex-col gap-4">
        {(orders ?? []).map((order) => (
          <div
            key={order.id}
            className={`flex flex-col gap-2 rounded-2xl border p-5 ${
              order.bank_transfer_claimed_at
                ? "border-accent bg-white"
                : "border-navy/10 bg-white/60"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold text-dark-text">
                {order.company_name} — {order.target_country}
              </p>
              {order.bank_transfer_claimed_at && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  입금했다고 알려옴 (
                  {new Date(order.bank_transfer_claimed_at).toLocaleString(
                    "ko-KR"
                  )}
                  )
                </span>
              )}
            </div>
            <p className="text-sm text-mute-text">
              금액: {(order.amount_krw ?? 20000).toLocaleString()}원 · 이메일:{" "}
              {order.email} · 연락처: {order.phone} · 신청:{" "}
              {new Date(order.created_at).toLocaleString("ko-KR")}
            </p>
            <p className="text-xs text-mute-text">주문번호: {order.id}</p>
            <a
              href={`/api/admin/reports/${order.id}/confirm-bank-transfer?secret=${encodeURIComponent(
                secret
              )}&redirectTo=${encodeURIComponent(redirectTo)}`}
              className="mt-2 inline-block w-fit rounded-full bg-navy px-5 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              입금 확인함, 리포트 생성 시작 (승인)
            </a>
          </div>
        ))}

        {(orders ?? []).length === 0 && (
          <p className="text-sm text-mute-text">
            결제 대기중인 주문이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
