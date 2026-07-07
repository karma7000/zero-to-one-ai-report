"use client";

export default function DownloadReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full border border-navy px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
    >
      리포트 다운로드 (PDF)
    </button>
  );
}
