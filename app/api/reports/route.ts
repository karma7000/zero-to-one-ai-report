import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rateLimit";
import { getReportPriceKrw } from "@/lib/payments/toss";
import { checkAiAvailability } from "@/lib/ai/checkAvailability";

const requestSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{9,20}$/, "연락처 형식을 확인해주세요."),
  targetCountry: z.string().trim().min(1).max(100),
  productDescription: z.string().trim().min(1).max(2000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: 사람은 비워둠
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "입력값을 확인해주세요.", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { companyName, email, phone, targetCountry, productDescription, website } =
    parsed.data;

  // honeypot에 값이 들어있으면 봇으로 간주하고 조용히 성공한 것처럼 응답
  if (website) {
    return Response.json({ reportId: crypto.randomUUID() }, { status: 202 });
  }

  try {
    const availability = await checkAiAvailability();
    if (!availability.available) {
      return Response.json(
        {
          error:
            "현재 AI 분석 서비스 이용이 일시적으로 불가능합니다. 잠시 후 다시 시도해주시거나 문의하기로 연락해주세요.",
        },
        { status: 503 }
      );
    }

    const limited = await isRateLimited(email);
    if (limited) {
      return Response.json(
        { error: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reports")
      .insert({
        status: "pending_payment",
        company_name: companyName,
        email,
        phone,
        target_country: targetCountry,
        product_description: productDescription,
        amount_krw: getReportPriceKrw(),
      })
      .select("id")
      .single();

    if (error || !data) {
      return Response.json(
        { error: `요청 생성에 실패했습니다: ${error?.message}` },
        { status: 500 }
      );
    }

    return Response.json({ reportId: data.id }, { status: 202 });
  } catch (err) {
    return Response.json(
      {
        error: `요청 처리 중 서버 오류가 발생했습니다: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 }
    );
  }
}
