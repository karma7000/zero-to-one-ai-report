import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  reportId: z.string().uuid().optional().or(z.literal("")),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
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

  const { reportId, email, phone, message } = parsed.data;

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("inquiries").insert({
      report_id: reportId || null,
      email,
      phone: phone || null,
      message,
    });

    if (error) {
      return Response.json(
        { error: `문의 접수에 실패했습니다: ${error.message}` },
        { status: 500 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    return Response.json(
      {
        error: `서버 오류가 발생했습니다: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 }
    );
  }
}
