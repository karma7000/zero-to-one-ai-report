import { getSupabaseServerClient } from "@/lib/supabase/server";

// 서버리스 함수 최대 실행시간(300초)보다 여유를 두고 정체 판정한다 - 두 값이
// 같으면 실제로는 아직 정상 완료 중인데도 폴링 타이밍에 따라 먼저 "실패"로
// 오판할 수 있기 때문에 6분으로 buffer를 준다.
const STALE_GENERATION_MS = 6 * 60 * 1000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, status, company_name, target_country, product_description, report_json, generation_error, generation_started_at"
    )
    .eq("id", reportId)
    .single();

  if (error || !data) {
    return Response.json({ error: "리포트를 찾을 수 없습니다." }, { status: 404 });
  }

  if (
    data.status === "generating" &&
    data.generation_started_at &&
    Date.now() - new Date(data.generation_started_at).getTime() > STALE_GENERATION_MS
  ) {
    const generation_error =
      "리포트 생성이 예상보다 오래 걸려 처리에 실패했습니다. 문의하기를 통해 알려주시면 다시 생성해드립니다.";

    await supabase
      .from("reports")
      .update({ status: "failed", generation_error })
      .eq("id", reportId);

    return Response.json({ ...data, status: "failed", generation_error });
  }

  return Response.json(data);
}
