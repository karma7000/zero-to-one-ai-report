import { getSupabaseServerClient } from "@/lib/supabase/server";
import { reportSchema } from "@/lib/ai/reportSchema";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reports")
    .select("status, company_name, target_country, report_json")
    .eq("id", reportId)
    .single();

  if (error || !data || data.status !== "completed" || !data.report_json) {
    return Response.json(
      { error: "완성된 리포트를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const parsed = reportSchema.safeParse(data.report_json);
  if (!parsed.success) {
    return Response.json(
      { error: "리포트 데이터 형식이 올바르지 않습니다." },
      { status: 500 }
    );
  }

  const pdfBuffer = await generateReportPdf(parsed.data, {
    companyName: data.company_name,
    targetCountry: data.target_country,
  });

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        `${data.company_name}-${data.target_country}-해외진출리포트.pdf`
      )}"`,
    },
  });
}
