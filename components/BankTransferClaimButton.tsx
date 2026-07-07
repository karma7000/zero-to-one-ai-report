"use client";

import { useState } from "react";

interface BankTransferClaimButtonProps {
  reportId: string;
}

export default function BankTransferClaimButton({
  reportId,
}: BankTransferClaimButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleClaim() {
    setStatus("sending");
    try {
      const res = await fetch(`/api/reports/${reportId}/claim-bank-transfer`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm font-semibold text-navy">
        입금 확인 요청을 보냈습니다. 확인 후 리포트 생성이 시작됩니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClaim}
        disabled={status === "sending"}
        className="rounded-full border border-navy px-5 py-2.5 text-sm font-extrabold text-navy transition hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-50"
      >
        {status === "sending" ? "전송 중..." : "입금했어요, 확인 요청하기"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600">
          요청에 실패했습니다. 다시 시도하시거나 문의하기로 알려주세요.
        </p>
      )}
    </div>
  );
}
