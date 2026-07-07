import Link from "next/link";
import ReportView from "@/components/ReportView";
import ZeroToOneCta from "@/components/ZeroToOneCta";
import { sampleReport, sampleReportMeta } from "@/lib/sampleReport";

export default function SamplePage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-cream/40 px-6 py-16">
      <div className="w-full max-w-2xl rounded-xl bg-orange/15 p-4 text-center text-sm font-semibold text-navy-deep">
        아래는 실제로 생성된 예시 리포트입니다 (회사명·수치는 예시 목적으로
        사용).{" "}
        <Link href="/" className="underline">
          지금 바로 우리 회사로 분석받기 →
        </Link>
      </div>

      <ReportView
        report={sampleReport}
        companyName={sampleReportMeta.companyName}
        targetCountry={sampleReportMeta.targetCountry}
      />

      <ZeroToOneCta />
    </div>
  );
}
