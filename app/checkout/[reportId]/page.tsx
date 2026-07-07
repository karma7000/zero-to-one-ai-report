import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import CheckoutWidget from "@/components/CheckoutWidget";
import InquiryForm from "@/components/InquiryForm";

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

      <CheckoutWidget
        reportId={order.id}
        amount={order.amount_krw ?? 20000}
        orderName={`AI 해외진출 리포트 (${order.target_country})`}
        customerEmail={order.email}
      />

      <InquiryForm reportId={order.id} />
    </div>
  );
}
