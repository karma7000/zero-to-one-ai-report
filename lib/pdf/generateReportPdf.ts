import path from "path";
import PDFDocument from "pdfkit";
import type { Report } from "@/lib/ai/reportSchema";

const REGULAR_FONT = path.join(process.cwd(), "lib/pdf/fonts/Pretendard-Regular.otf");
const BOLD_FONT = path.join(process.cwd(), "lib/pdf/fonts/Pretendard-Bold.otf");

interface ReportPdfMeta {
  companyName: string;
  targetCountry: string;
}

export function generateReportPdf(
  report: Report,
  meta: ReportPdfMeta
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("Pretendard", REGULAR_FONT);
    doc.registerFont("Pretendard-Bold", BOLD_FONT);
    doc.font("Pretendard");

    const heading = (text: string) => {
      doc.moveDown(1);
      doc.font("Pretendard-Bold").fontSize(15).fillColor("#213e8f").text(text);
      doc.font("Pretendard").fontSize(10.5).fillColor("#1a1a1a");
      doc.moveDown(0.4);
    };

    const subheading = (text: string) => {
      doc.font("Pretendard-Bold").fontSize(11.5).fillColor("#1a1a1a").text(text);
      doc.font("Pretendard").fontSize(10.5).fillColor("#333333");
      doc.moveDown(0.2);
    };

    const paragraph = (text: string) => {
      doc.font("Pretendard").fontSize(10.5).fillColor("#333333").text(text, {
        align: "left",
      });
      doc.moveDown(0.3);
    };

    const bulletList = (items: string[]) => {
      items.forEach((item) => {
        doc
          .font("Pretendard")
          .fontSize(10.5)
          .fillColor("#333333")
          .text(`• ${item}`, { indent: 10 });
      });
      doc.moveDown(0.3);
    };

    // 제목
    doc.font("Pretendard-Bold").fontSize(11).fillColor("#c88a1f").text("ZERO TO ONE COMPANY · AI 분석 리포트");
    doc.moveDown(0.2);
    doc
      .font("Pretendard-Bold")
      .fontSize(19)
      .fillColor("#111111")
      .text(`${meta.companyName} — ${meta.targetCountry} 해외진출 분석 리포트`);

    // 1. 해외진출 매력도
    heading(`해외진출 매력도 — ${report.market_attractiveness.score}점 / 100`);
    paragraph(report.market_attractiveness.summary);
    paragraph(report.market_attractiveness.rationale);
    bulletList(report.market_attractiveness.key_factors);

    // 2. 이커머스 채널
    heading("이커머스 채널 분석");
    paragraph(report.ecommerce_channels.overview);
    report.ecommerce_channels.channels.forEach((channel) => {
      subheading(`${channel.platform_name} (적합도 ${channel.fit_score}/10)`);
      paragraph(`왜 적합한가: ${channel.why_it_fits}`);
      paragraph(`진출 전략: ${channel.entry_strategy}`);
      paragraph(`예상 수수료/비용: ${channel.estimated_fees_or_costs}`);
    });

    // 3. 오프라인 채널
    heading("오프라인 채널 분석");
    paragraph(report.offline_channels.overview);
    paragraph(`유통 구조: ${report.offline_channels.distribution_structure}`);
    report.offline_channels.channels.forEach((channel) => {
      subheading(channel.channel_type);
      paragraph(channel.description);
      paragraph(`진출 전략: ${channel.entry_strategy}`);
    });

    // 4. 사업성 분석
    heading("사업성 분석");
    subheading("리스크");
    bulletList(report.business_feasibility.risks);
    subheading("기회 요인");
    bulletList(report.business_feasibility.opportunities);
    subheading("규제 참고사항");
    paragraph(report.business_feasibility.regulatory_notes);
    subheading("종합 사업성");
    paragraph(report.business_feasibility.overall_viability);

    // 5. 비즈니스 제안
    heading("비즈니스 제안");
    subheading("추천 진출 전략");
    paragraph(report.business_proposal.recommended_entry_strategy);
    subheading("추천 주력 채널");
    paragraph(report.business_proposal.recommended_primary_channel);
    subheading("운영 계획");
    paragraph(report.business_proposal.operations_plan);
    subheading("로드맵");
    report.business_proposal.roadmap.forEach((phase) => {
      doc.font("Pretendard-Bold").fontSize(10.5).fillColor("#1a1a1a").text(phase.phase);
      bulletList(phase.actions);
    });
    subheading("다음 단계");
    bulletList(report.business_proposal.next_steps);

    // 하단 안내
    doc.moveDown(1);
    doc
      .font("Pretendard")
      .fontSize(8.5)
      .fillColor("#888888")
      .text(
        "본 리포트는 AI가 생성한 참고용 분석 자료이며, 실제 계약·투자 결정 전 별도 검토가 필요합니다.",
        { align: "left" }
      );

    doc.end();
  });
}
