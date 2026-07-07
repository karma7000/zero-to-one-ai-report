const ZERO_TO_ONE_URL = "https://karma7000.github.io/zero-to-one-landing/index.html";
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sWDRY35h";

export default function SiteNav() {
  return (
    <nav className="no-print fixed inset-x-0 top-0 z-50 h-[68px] bg-navy-deep/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <a href="/" className="flex flex-col leading-tight">
          <span className="text-[15px] font-extrabold tracking-wide text-white">
            Zero <span className="text-orange">to</span> One Company
          </span>
          <span className="text-[11px] font-medium text-light-text">
            AI 해외진출 진단
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full border border-white/40 px-4 py-2 text-[13px] font-extrabold text-white transition hover:bg-white/10"
          >
            카톡 문의
          </a>
          <a
            href={ZERO_TO_ONE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-orange px-4 py-2 text-[13px] font-extrabold text-navy-deep transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            제로투원 홈페이지
          </a>
        </div>
      </div>
    </nav>
  );
}
