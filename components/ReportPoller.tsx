"use client";

import { useEffect, useState } from "react";
import ReportView from "./ReportView";
import ZeroToOneCta from "./ZeroToOneCta";
import InquiryForm from "./InquiryForm";
import DownloadReportButton from "./DownloadReportButton";
import type { Report } from "@/lib/ai/reportSchema";

interface StatusResponse {
  status: "pending_payment" | "generating" | "completed" | "failed";
  company_name: string;
  target_country: string;
  report_json: Report | null;
  generation_error: string | null;
}

const POLL_INTERVAL_MS = 4000;

export default function ReportPoller({ reportId }: { reportId: string }) {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/reports/${reportId}/status`);
        if (!res.ok) {
          if (!cancelled) setFetchError("리포트를 찾을 수 없습니다.");
          return;
        }
        const json: StatusResponse = await res.json();
        if (cancelled) return;
        setData(json);

        if (json.status === "generating") {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reportId]);

  if (fetchError) {
    return <p className="text-red-600">{fetchError}</p>;
  }

  if (data?.status === "pending_payment") {
    return (
      <p className="text-center text-mute-text">
        아직 결제가 완료되지 않았습니다.{" "}
        <a href={`/checkout/${reportId}`} className="font-bold text-navy underline">
          결제 페이지로 이동
        </a>
      </p>
    );
  }

  if (!data || data.status === "generating") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
        <p className="text-mute-text">
          AI가 웹 검색을 통해 시장 정보를 조사하고 리포트를 작성하고 있습니다.
          <br />
          보통 3~5분 정도 소요됩니다.
          <br />
          대기하는 동안 이 창을 끄지 마시고, 다른 창을 보셔도 됩니다.
        </p>
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-600">
          리포트 생성에 실패했습니다: {data.generation_error}
        </p>
        <InquiryForm reportId={reportId} />
      </div>
    );
  }

  if (!data.report_json) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-600">리포트 데이터를 불러오지 못했습니다.</p>
        <InquiryForm reportId={reportId} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <DownloadReportButton reportId={reportId} />
      <ReportView
        report={data.report_json}
        companyName={data.company_name}
        targetCountry={data.target_country}
      />
      <InquiryForm reportId={reportId} />
      <ZeroToOneCta />
    </div>
  );
}
