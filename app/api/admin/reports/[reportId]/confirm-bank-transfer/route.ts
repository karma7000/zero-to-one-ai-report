import { getSupabaseServerClient } from "@/lib/supabase/server";
import { REPORT_MODEL } from "@/lib/ai/generateReport";
import { startReportGeneration } from "@/lib/reports/startGeneration";

export const maxDuration = 300;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const redirectTo = url.searchParams.get("redirectTo");

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data: order, error } = await supabase
    .from("reports")
    .select("id, status, company_name, target_country, product_description")
    .eq("id", reportId)
    .single();

  if (error || !order) {
    return new Response("주문을 찾을 수 없습니다.", { status: 404 });
  }

  if (order.status !== "pending_payment") {
    if (redirectTo) {
      return Response.redirect(new URL(redirectTo, url.origin));
    }
    return new Response(`이미 처리된 주문입니다 (현재 상태: ${order.status})`, {
      status: 400,
    });
  }

  await supabase
    .from("reports")
    .update({
      status: "generating",
      payment_provider: "bank_transfer",
      paid_at: new Date().toISOString(),
      generation_started_at: new Date().toISOString(),
      model_used: REPORT_MODEL,
    })
    .eq("id", reportId);

  startReportGeneration({
    reportId: order.id,
    companyName: order.company_name,
    targetCountry: order.target_country,
    productDescription: order.product_description,
  });

  if (redirectTo) {
    return Response.redirect(new URL(redirectTo, url.origin));
  }

  return new Response(
    `입금 확인 처리되었습니다. 리포트 생성이 시작됩니다.\n\n확인: ${url.origin}/report/${reportId}`,
    { status: 200 }
  );
}
