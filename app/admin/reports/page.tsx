import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string; q?: string }>;
}) {
  const { secret, q } = await searchParams;

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

  const search = (q ?? "").trim();
  let completedQuery = supabase
    .from("reports")
    .select(
      "id, company_name, target_country, email, phone, generation_completed_at"
    )
    .eq("status", "completed")
    .order("generation_completed_at", { ascending: false })
    .limit(30);

  if (search) {
    completedQuery = completedQuery.or(
      `company_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data: completedReports } = await completedQuery;

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

      <hr className="border-navy/10" />

      <h2 className="text-xl font-extrabold text-dark-text">
        완료된 리포트 조회 · 재발송
      </h2>
      <p className="text-sm text-mute-text">
        손님이 PDF를 못 받았거나 다시 요청하는 경우, 회사명 또는 이메일로
        검색해 리포트 링크나 PDF를 다시 전달해주세요.
      </p>

      <form method="GET" className="flex gap-2">
        <input type="hidden" name="secret" value={secret} />
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="회사명 또는 이메일로 검색"
          className="flex-1 rounded-full border border-navy/20 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-navy px-5 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          검색
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {(completedReports ?? []).map((report) => (
          <div
            key={report.id}
            className="flex flex-col gap-2 rounded-2xl border border-navy/10 bg-white p-5"
          >
            <p className="font-extrabold text-dark-text">
              {report.company_name} — {report.target_country}
            </p>
            <p className="text-sm text-mute-text">
              이메일: {report.email} · 연락처: {report.phone} · 완료:{" "}
              {report.generation_completed_at
                ? new Date(report.generation_completed_at).toLocaleString(
                    "ko-KR"
                  )
                : "-"}
            </p>
            <p className="text-xs text-mute-text">주문번호: {report.id}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={`/report/${report.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-fit rounded-full border border-navy px-5 py-2 text-sm font-extrabold text-navy transition hover:bg-navy hover:text-white"
              >
                리포트 보기
              </a>
              <a
                href={`/api/reports/${report.id}/pdf`}
                className="inline-block w-fit rounded-full border border-navy px-5 py-2 text-sm font-extrabold text-navy transition hover:bg-navy hover:text-white"
              >
                PDF 다운로드
              </a>
            </div>
          </div>
        ))}

        {(completedReports ?? []).length === 0 && (
          <p className="text-sm text-mute-text">
            {search
              ? "검색 결과가 없습니다."
              : "완료된 리포트가 아직 없습니다."}
          </p>
        )}
      </div>
    </div>
  );
}
