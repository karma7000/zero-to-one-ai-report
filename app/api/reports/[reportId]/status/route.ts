import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, status, company_name, target_country, product_description, report_json, generation_error"
    )
    .eq("id", reportId)
    .single();

  if (error || !data) {
    return Response.json({ error: "리포트를 찾을 수 없습니다." }, { status: 404 });
  }

  return Response.json(data);
}
