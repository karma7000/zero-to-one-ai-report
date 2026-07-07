"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

interface CheckoutWidgetProps {
  reportId: string;
  amount: number;
  orderName: string;
  customerEmail: string;
}

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;

export default function CheckoutWidget({
  reportId,
  amount,
  orderName,
  customerEmail,
}: CheckoutWidgetProps) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!CLIENT_KEY) {
        setErrorMessage("결제 설정이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      if (cancelled) return;
      widgetsRef.current = widgets;

      await widgets.setAmount({ currency: "KRW", value: amount });
      await widgets.renderPaymentMethods({ selector: "#payment-method" });
      await widgets.renderAgreement({ selector: "#agreement" });

      if (!cancelled) setReady(true);
    }

    setup().catch((err) => {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    });

    return () => {
      cancelled = true;
    };
  }, [amount]);

  async function handlePay() {
    if (!widgetsRef.current) return;
    setPaying(true);
    setErrorMessage(null);

    try {
      const availabilityRes = await fetch("/api/ai-availability");
      const availability = await availabilityRes.json();
      if (!availability.available) {
        setErrorMessage(
          "현재 AI 분석 서비스 이용이 일시적으로 불가능합니다. 잠시 후 다시 시도해주시거나 문의하기로 연락해주세요."
        );
        setPaying(false);
        return;
      }
    } catch {
      // 가용성 확인 자체가 실패해도 결제 시도는 막지 않음 (결제 승인 단계에서 최종 검증됨)
    }

    try {
      await widgetsRef.current.requestPayment({
        orderId: reportId,
        orderName,
        customerEmail,
        successUrl: `${window.location.origin}/api/payments/toss/confirm`,
        failUrl: `${window.location.origin}/checkout/${reportId}?error=payment_failed`,
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-7 shadow-[0_20px_50px_rgba(33,62,143,0.12)]">
      <div id="payment-method" />
      <div id="agreement" />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="button"
        onClick={handlePay}
        disabled={!ready || paying}
        className="mt-2 rounded-full bg-orange px-5 py-3 font-extrabold text-navy-deep transition hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
      >
        {paying ? "결제 진행 중..." : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}
