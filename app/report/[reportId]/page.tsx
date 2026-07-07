import ReportPoller from "@/components/ReportPoller";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-cream/40 px-6 py-16">
      <ReportPoller reportId={reportId} />
    </div>
  );
}
