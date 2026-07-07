const ZERO_TO_ONE_URL = "https://karma7000.github.io/zero-to-one-landing/index.html";
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sWDRY35h";

export default function ZeroToOneCta() {
  return (
    <div className="no-print w-full max-w-xl mx-auto rounded-2xl bg-cream p-6 text-center">
      <p className="mb-1 text-[13px] font-bold tracking-[2px] text-accent">
        ZERO TO ONE COMPANY
      </p>
      <p className="mb-4 text-sm text-mute-text">
        더 깊이 있는 해외진출 컨설팅이 필요하신가요?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={KAKAO_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-navy px-5 py-2.5 font-extrabold text-navy transition hover:bg-navy hover:text-white"
        >
          카톡으로 바로 문의하기
        </a>
        <a
          href={ZERO_TO_ONE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-navy px-5 py-2.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          제로투원에서 추가 컨설팅 받기
        </a>
      </div>
    </div>
  );
}
