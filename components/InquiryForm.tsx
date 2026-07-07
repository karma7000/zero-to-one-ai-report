"use client";

import { useState, type FormEvent } from "react";

interface InquiryFormProps {
  reportId?: string;
}

export default function InquiryForm({ reportId }: InquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, email, phone, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "문의 접수 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }

      setDone(true);
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="no-print text-xs font-bold text-navy underline"
      >
        결제/리포트 문의하기
      </button>
    );
  }

  if (done) {
    return (
      <p className="no-print text-xs text-mute-text">
        문의가 접수되었습니다. 확인 후 입력하신 이메일 또는 연락처로 답변드리겠습니다.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print flex w-full max-w-xl flex-col gap-2 rounded-xl border border-gray-panel/40 bg-white p-4 text-left"
    >
      <p className="text-xs font-bold text-dark-text">결제/리포트 문의하기</p>
      <input
        type="email"
        required
        placeholder="답변받을 이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-gray-panel/50 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <input
        type="tel"
        placeholder="연락처 (선택)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-lg border border-gray-panel/50 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      <textarea
        required
        rows={3}
        placeholder="문의 내용을 입력해주세요."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded-lg border border-gray-panel/50 px-3 py-2 text-sm outline-none focus:border-navy"
      />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white transition disabled:opacity-50"
      >
        {submitting ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
