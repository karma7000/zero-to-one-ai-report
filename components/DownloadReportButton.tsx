export default function DownloadReportButton({
  reportId,
}: {
  reportId: string;
}) {
  return (
    <a
      href={`/api/reports/${reportId}/pdf`}
      download
      className="no-print rounded-full border border-navy px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
    >
      리포트 다운로드 (PDF)
    </a>
  );
}
