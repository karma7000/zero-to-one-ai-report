import { after } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { confirmTossPayment } from "@/lib/payments/toss";
import { generateReport, REPORT_MODEL } from "@/lib/ai/generateReport";

export const maxDuration = 120;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentKey = url.searchParams.get("paymentKey");
  const orderId = url.searchParams.get("orderId");
  const amountParam = url.searchParams.get("amount");

  if (!paymentKey || !orderId || !amountParam) {
    return Response.redirect(
      new URL(`/checkout/${orderId ?? ""}?error=invalid_request`, url.origin)
    );
  }

  const amount = Number(amountParam);
  const supabase = getSupabaseServerClient();

  const { data: order, error: fetchError } = await supabase
    .from("reports")
    .select("id, status, amount_krw, company_name, target_country, product_description")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return Response.redirect(new URL(`/checkout/${orderId}?error=not_found`, url.origin));
  }

  // 이미 결제 확인이 처리된 주문이면 (중복 리다이렉트 등) 그대로 리포트 페이지로 이동
  if (order.status !== "pending_payment") {
    return Response.redirect(new URL(`/report/${orderId}`, url.origin));
  }

  if (order.amount_krw !== amount) {
    return Response.redirect(new URL(`/checkout/${orderId}?error=amount_mismatch`, url.origin));
  }

  try {
    await confirmTossPayment({ paymentKey, orderId, amount });
  } catch (err) {
    await supabase
      .from("reports")
      .update({
        status: "failed",
        generation_error: err instanceof Error ? err.message : String(err),
      })
      .eq("id", orderId);

    return Response.redirect(
      new URL(`/checkout/${orderId}?error=payment_confirm_failed`, url.origin)
    );
  }

  const { companyName, targetCountry, productDescription } = {
    companyName: order.company_name,
    targetCountry: order.target_country,
    productDescription: order.product_description,
  };

  await supabase
    .from("reports")
    .update({
      status: "generating",
      payment_provider: "toss",
      provider_payment_id: paymentKey,
      paid_at: new Date().toISOString(),
      generation_started_at: new Date().toISOString(),
      model_used: REPORT_MODEL,
    })
    .eq("id", orderId);

  after(async () => {
    try {
      const report = await generateReport({
        companyName,
        targetCountry,
        productDescription,
      });

      await supabase
        .from("reports")
        .update({
          status: "completed",
          report_json: report,
          generation_completed_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    } catch (err) {
      await supabase
        .from("reports")
        .update({
          status: "failed",
          generation_error: err instanceof Error ? err.message : String(err),
          generation_completed_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }
  });

  return Response.redirect(new URL(`/report/${orderId}`, url.origin));
}
