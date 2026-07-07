import type { Report } from "@/lib/ai/reportSchema";

interface ReportViewProps {
  report: Report;
  companyName: string;
  targetCountry: string;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full rounded-2xl border border-gray-panel/40 bg-white p-6 shadow-[0_10px_30px_rgba(33,62,143,0.06)]">
      <h2 className="mb-3 text-lg font-extrabold text-navy">{title}</h2>
      {children}
    </section>
  );
}

export default function ReportView({
  report,
  companyName,
  targetCountry,
}: ReportViewProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="text-center">
        <p className="mb-2 text-[12px] font-bold tracking-[2px] text-accent">
          ZERO TO ONE COMPANY · AI 분석 리포트
        </p>
        <h1 className="text-2xl font-extrabold text-dark-text">
          {companyName} — {targetCountry} 해외진출 분석 리포트
        </h1>
      </div>

      <Section title={`해외진출 매력도 — ${report.market_attractiveness.score}점 / 100`}>
        <p className="mb-2 font-semibold text-dark-text">
          {report.market_attractiveness.summary}
        </p>
        <p className="mb-3 text-sm text-mute-text">
          {report.market_attractiveness.rationale}
        </p>
        <ul className="list-disc pl-5 text-sm text-dark-text">
          {report.market_attractiveness.key_factors.map((factor, i) => (
            <li key={i}>{factor}</li>
          ))}
        </ul>
      </Section>

      <Section title="이커머스 채널 분석">
        <p className="mb-3 text-sm text-mute-text">
          {report.ecommerce_channels.overview}
        </p>
        <div className="flex flex-col gap-3">
          {report.ecommerce_channels.channels.map((ch, i) => (
            <div key={i} className="rounded-lg bg-cream p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-dark-text">{ch.platform_name}</span>
                <span className="text-sm text-accent">적합도 {ch.fit_score}/10</span>
              </div>
              <p className="mb-1 text-sm text-dark-text">{ch.why_it_fits}</p>
              <p className="mb-1 text-sm text-mute-text">
                진입 전략: {ch.entry_strategy}
              </p>
              <p className="text-xs text-mute-text">
                예상 수수료/비용: {ch.estimated_fees_or_costs}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="오프라인 채널 분석">
        <p className="mb-1 text-sm text-mute-text">
          {report.offline_channels.overview}
        </p>
        <p className="mb-3 text-sm text-mute-text">
          유통 구조: {report.offline_channels.distribution_structure}
        </p>
        <div className="flex flex-col gap-3">
          {report.offline_channels.channels.map((ch, i) => (
            <div key={i} className="rounded-lg bg-cream p-3">
              <p className="mb-1 font-bold text-dark-text">{ch.channel_type}</p>
              <p className="mb-1 text-sm text-dark-text">{ch.description}</p>
              <p className="text-sm text-mute-text">
                진입 전략: {ch.entry_strategy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="사업성 분석">
        <p className="mb-3 text-sm text-dark-text">
          {report.business_feasibility.overall_viability}
        </p>
        <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-bold text-navy">리스크</p>
            <ul className="list-disc pl-5 text-sm text-mute-text">
              {report.business_feasibility.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-navy">기회 요인</p>
            <ul className="list-disc pl-5 text-sm text-mute-text">
              {report.business_feasibility.opportunities.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-mute-text">
          규제/관세 참고: {report.business_feasibility.regulatory_notes}
        </p>
      </Section>

      <Section title="AI 비즈니스 제안">
        <p className="mb-1 text-sm font-bold text-dark-text">
          추천 진출 전략: {report.business_proposal.recommended_entry_strategy}
        </p>
        <p className="mb-3 text-sm font-bold text-dark-text">
          추천 우선 채널: {report.business_proposal.recommended_primary_channel}
        </p>
        <p className="mb-3 text-sm text-mute-text">
          {report.business_proposal.operations_plan}
        </p>
        <div className="mb-3 flex flex-col gap-2">
          {report.business_proposal.roadmap.map((r, i) => (
            <div key={i}>
              <p className="text-sm font-bold text-navy">{r.phase}</p>
              <ul className="list-disc pl-5 text-sm text-mute-text">
                {r.actions.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mb-1 text-sm font-bold text-dark-text">다음 단계</p>
        <ul className="list-disc pl-5 text-sm text-dark-text">
          {report.business_proposal.next_steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </Section>

      <p className="text-center text-xs text-mute-text">
        본 리포트는 AI가 생성한 분석 자료이며, 실제 계약이나 투자 결정 전
        전문가 검토를 권장합니다.
      </p>
    </div>
  );
}
