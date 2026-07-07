import { getAnthropicClient } from "./anthropic";

interface AvailabilityCache {
  available: boolean;
  reason: string | null;
  checkedAt: number;
}

let cache: AvailabilityCache | null = null;
const CACHE_TTL_MS = 60_000; // 1분마다만 재확인 (프로브 비용 최소화)

function isCreditError(message: string): boolean {
  return /credit balance is too low/i.test(message);
}

/**
 * Anthropic API 크레딧이 남아있어 리포트 생성이 가능한 상태인지 확인합니다.
 * 최소 비용의 probe 호출로 확인하며, 결과는 짧게 캐싱해 반복 호출 비용을 줄입니다.
 */
export async function checkAiAvailability(): Promise<{
  available: boolean;
  reason: string | null;
}> {
  if (cache && Date.now() - cache.checkedAt < CACHE_TTL_MS) {
    return { available: cache.available, reason: cache.reason };
  }

  try {
    const client = getAnthropicClient();
    await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1,
      messages: [{ role: "user", content: "ping" }],
    });

    cache = { available: true, reason: null, checkedAt: Date.now() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (isCreditError(message)) {
      cache = {
        available: false,
        reason: "AI 크레딧이 부족하여 리포트를 생성할 수 없습니다.",
        checkedAt: Date.now(),
      };
    } else {
      // 크레딧 문제가 아닌 다른 오류(네트워크 등)는 서비스 자체를 막지 않음
      cache = { available: true, reason: null, checkedAt: Date.now() };
    }
  }

  return { available: cache.available, reason: cache.reason };
}
