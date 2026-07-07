import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAnthropicClient } from "./anthropic";
import { reportSchema, type Report } from "./reportSchema";

interface GenerateReportInput {
  companyName: string;
  targetCountry: string;
  productDescription: string;
}

const MODEL = process.env.AI_MODEL || "claude-sonnet-5";
const MAX_WEB_SEARCHES = 10;

const SYSTEM_PROMPT = `당신은 한국 중소/중견기업의 해외진출을 돕는 컨설턴트입니다.
주어진 대상 국가와 제품 정보를 바탕으로, 웹 검색 도구를 활용해 최신 시장 정보를 조사한 뒤
해외진출 매력도, 이커머스 채널, 오프라인 채널, 사업성, 비즈니스 제안을 분석합니다.
모든 텍스트 답변은 반드시 한국어로 작성하세요.
가능하면 구체적인 수치, 플랫폼명, 유통 구조를 근거로 제시하고, 확실하지 않은 정보는 추정임을 밝히세요.`;

export async function generateReport(
  input: GenerateReportInput
): Promise<Report> {
  const client = getAnthropicClient();

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `다음 기업의 해외진출 분석 리포트를 작성해주세요.

- 회사명: ${input.companyName}
- 대상 국가: ${input.targetCountry}
- 제품/서비스 설명: ${input.productDescription}

웹 검색을 통해 해당 국가의 최신 이커머스 플랫폼 현황, 오프라인 유통 구조, 관세/규제 정보를 확인하고
정의된 스키마에 맞춰 구조화된 리포트를 생성하세요.`,
      },
    ],
    tools: [
      {
        type: "web_search_20260318",
        name: "web_search",
        max_uses: MAX_WEB_SEARCHES,
      },
    ],
    output_config: {
      format: zodOutputFormat(reportSchema),
    },
  });

  const finalMessage = await stream.finalMessage();

  if (!finalMessage.parsed_output) {
    throw new Error("AI가 구조화된 리포트를 생성하지 못했습니다.");
  }

  return finalMessage.parsed_output;
}

export { MODEL as REPORT_MODEL };
