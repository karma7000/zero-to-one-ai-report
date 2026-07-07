import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const supabase = getSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("reports")
    .select("id, status")
    .eq("id", reportId)
    .single();

  if (error || !order) {
    return Response.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  if (order.status !== "pending_payment") {
    return Response.json(
      { error: "이미 처리된 주문입니다." },
      { status: 400 }
    );
  }

  await supabase
    .from("reports")
    .update({ bank_transfer_claimed_at: new Date().toISOString() })
    .eq("id", reportId);

  return Response.json({ ok: true });
}
