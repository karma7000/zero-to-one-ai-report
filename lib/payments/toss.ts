const TOSS_API_BASE = "https://api.tosspayments.com/v1";

interface ConfirmPaymentInput {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface ConfirmPaymentResult {
  paymentKey: string;
  orderId: string;
  totalAmount: number;
  status: string;
}

export async function confirmTossPayment({
  paymentKey,
  orderId,
  amount,
}: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TOSS_SECRET_KEY 환경변수가 설정되어야 합니다.");
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `토스 결제 승인 실패: ${data.message || res.statusText} (${data.code || res.status})`
    );
  }

  return data;
}

export function getReportPriceKrw(): number {
  return Number(process.env.REPORT_PRICE_KRW || 20000);
}
