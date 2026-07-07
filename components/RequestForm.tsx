"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

const inputClassName =
  "rounded-lg border border-gray-panel/50 bg-white px-3 py-2 text-dark-text outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15";

export default function RequestForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          email,
          phone,
          targetCountry,
          productDescription,
          website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "요청 처리 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }

      router.push(`/checkout/${data.reportId}`);
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-7 shadow-[0_20px_50px_rgba(33,62,143,0.12)]"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="companyName" className="text-sm font-semibold text-dark-text">
          회사명
        </label>
        <input
          id="companyName"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={inputClassName}
          placeholder="예: 제로투원"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold text-dark-text">
          이메일
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          placeholder="you@company.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-semibold text-dark-text">
          연락처
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClassName}
          placeholder="예: 010-1234-5678"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="targetCountry" className="text-sm font-semibold text-dark-text">
          진출 희망 국가
        </label>
        <select
          id="targetCountry"
          required
          value={targetCountry}
          onChange={(e) => setTargetCountry(e.target.value)}
          className={inputClassName}
        >
          <option value="" disabled>
            국가를 선택해주세요
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <p className="text-xs text-mute-text">
          목록에 없는 국가는{" "}
          <a
            href="https://karma7000.github.io/zero-to-one-landing/contact.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-navy underline"
          >
            문의하기
          </a>
          로 알려주세요.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="productDescription"
          className="text-sm font-semibold text-dark-text"
        >
          제품/서비스 설명
        </label>
        <p className="text-xs text-mute-text">
          제품군, 주요 성분/기능, 타겟 고객층, 가격대를 포함해 작성하시면 더
          정확한 분석을 받을 수 있습니다.
        </p>
        <textarea
          id="productDescription"
          required
          rows={4}
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className={inputClassName}
          placeholder="예: 천연 성분(어성초, 병풀) 기반 저자극 스킨케어 화장품 라인(토너·크림), 20~30대 여성 타겟, 중가(2~5만원대) 포지셔닝"
        />
      </div>

      {/* honeypot: 실제 사용자에게는 보이지 않음 */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-orange px-5 py-3 font-extrabold text-navy-deep transition hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
      >
        {submitting ? "결제 페이지로 이동 중..." : "AI 분석 리포트 신청하기 (20,000원)"}
      </button>

      <p className="text-xs text-mute-text">
        결제 완료 후 AI가 실시간 웹 검색을 통해 리포트를 생성합니다.
      </p>
    </form>
  );
}
