import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "정보 입력",
    desc: "회사명, 연락처, 진출 희망 국가, 제품/서비스 정보를 입력합니다.",
  },
  {
    num: "02",
    title: "AI 실시간 분석",
    desc: "AI가 웹 검색을 통해 최신 시장 정보를 조사하고 리포트를 작성합니다 (약 1~2분 소요).",
  },
  {
    num: "03",
    title: "리포트 확인",
    desc: "해외진출 매력도, 이커머스/오프라인 채널, 사업성, 비즈니스 제안을 확인합니다.",
  },
];

export default function UsageGuide() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="rounded-2xl border border-gray-panel/40 bg-white p-5 text-center"
          >
            <p className="mb-2 text-lg font-extrabold text-accent">{step.num}</p>
            <p className="mb-1 font-bold text-dark-text">{step.title}</p>
            <p className="text-xs text-mute-text">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/sample"
          className="inline-block rounded-full border border-navy px-5 py-2.5 font-bold text-navy transition hover:bg-navy hover:text-white"
        >
          샘플 리포트 미리 보기
        </Link>
      </div>
    </div>
  );
}
