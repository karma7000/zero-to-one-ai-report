import { checkAiAvailability } from "@/lib/ai/checkAvailability";

export async function GET() {
  const availability = await checkAiAvailability();
  return Response.json(availability);
}
