"use client";

import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 4000;

export default function CheckoutStatusPoller({
  reportId,
}: {
  reportId: string;
}) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/reports/${reportId}/status`);
        if (res.ok) {
          const json = await res.json();
          if (json.status && json.status !== "pending_payment") {
            if (!cancelled) {
              setApproved(true);
              window.location.href = `/report/${reportId}`;
            }
            return;
          }
        }
      } catch {
        // 무시하고 계속 폴링
      }
      if (!cancelled) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reportId]);

  if (!approved) return null;

  return (
    <p className="text-sm font-semibold text-navy">
      입금이 승인되었습니다! 리포트 페이지로 이동합니다...
    </p>
  );
}
