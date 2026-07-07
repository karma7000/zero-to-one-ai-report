import { after } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateReport } from "@/lib/ai/generateReport";

interface StartGenerationInput {
  reportId: string;
  companyName: string;
  targetCountry: string;
  productDescription: string;
}

export function startReportGeneration(input: StartGenerationInput) {
  const supabase = getSupabaseServerClient();

  after(async () => {
    try {
      const report = await generateReport({
        companyName: input.companyName,
        targetCountry: input.targetCountry,
        productDescription: input.productDescription,
      });

      await supabase
        .from("reports")
        .update({
          status: "completed",
          report_json: report,
          generation_completed_at: new Date().toISOString(),
        })
        .eq("id", input.reportId);
    } catch (err) {
      await supabase
        .from("reports")
        .update({
          status: "failed",
          generation_error: err instanceof Error ? err.message : String(err),
          generation_completed_at: new Date().toISOString(),
        })
        .eq("id", input.reportId);
    }
  });
}
