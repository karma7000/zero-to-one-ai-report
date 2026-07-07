import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import CheckoutWidget from "@/components/CheckoutWidget";
import BankTransferInfo from "@/components/BankTransferInfo";
import BankTransferClaimButton from "@/components/BankTransferClaimButton";
import CheckoutStatusPoller from "@/components/CheckoutStatusPoller";
import InquiryForm from "@/components/InquiryForm";

// 토스 심사가 끝나 라이브 키(live_로 시작)로 교체되기 전까지는 카드 결제 위젯을
// 숨긴다 - 테스트 키는 실제 과금 없이도 결제완료로 처리되어 무료로 리포트를
// 받아갈 수 있는 구멍이 생기기 때문. 라이브 키로 바꾸는 순간 자동으로 노출된다.
const TOSS_IS_LIVE = (process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "").startsWith(
  "live_"
);

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { reportId } = await params;
  const { error } = await searchParams;

  const supabase = getSupabaseServerClient();
  const { data: order } = await supabase
    .from("reports")
    .select("id, status, company_name, email, target_country, amount_krw")
    .eq("id", reportId)
    .single();

  if (!order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-cream/40 px-6 py-16">
        <p className="text-red-600">주문을 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (order.status !== "pending_payment") {
    redirect(`/report/${reportId}`);
  }

  const ERROR_MESSAGES: Record<string, string> = {
    payment_failed: "결제가 취소되었거나 실패했습니다. 다시 시도해주세요.",
    amount_mismatch: "결제 금액이 일치하지 않습니다. 다시 시도해주세요.",
    payment_confirm_failed: "결제 승인 중 오류가 발생했습니다. 다시 시도해주세요.",
    not_found: "주문 정보를 찾을 수 없습니다.",
    invalid_request: "잘못된 요청입니다. 다시 시도해주세요.",
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 bg-cream/40 px-6 py-16">
      <div className="text-center">
        <p className="mb-2 text-[13px] font-bold tracking-[2px] text-accent">
          ZERO TO ONE COMPANY · 결제
        </p>
        <h1 className="text-xl font-extrabold text-dark-text">
          {order.company_name} — {order.target_country} 해외진출 분석 리포트
        </h1>
      </div>

      {error && ERROR_MESSAGES[error] && (
        <p className="text-sm text-red-600">{ERROR_MESSAGES[error]}</p>
      )}

      <CheckoutStatusPoller reportId={order.id} />

      {TOSS_IS_LIVE ? (
        <CheckoutWidget
          reportId={order.id}
          amount={order.amount_krw ?? 20000}
          orderName={`AI 해외진출 리포트 (${order.target_country})`}
          customerEmail={order.email}
        />
      ) : (
        <p className="text-sm text-mute-text">
          카드 결제는 준비 중입니다. 아래 계좌이체를 이용해주세요.
        </p>
      )}

      <BankTransferInfo
        reportId={order.id}
        amount={order.amount_krw ?? 20000}
        companyName={order.company_name}
      />

      <BankTransferClaimButton reportId={order.id} />

      <InquiryForm reportId={order.id} />
    </div>
  );
}
