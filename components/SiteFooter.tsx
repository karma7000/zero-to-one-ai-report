export default function SiteFooter() {
  return (
    <footer className="no-print bg-black-band px-6 py-8 text-[13px] text-light-text">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-bold text-white">Zero to One Company</span>
            <span className="ml-2">— AI 해외진출 진단 서비스</span>
          </div>
          <div>본 리포트는 AI가 생성한 참고용 분석 자료입니다.</div>
        </div>
        <div className="border-t border-white/10 pt-3 text-[12px] leading-relaxed text-light-text/70">
          상호: 제로투원 · 대표자: 권성우 · 사업자등록번호: 207-45-01144
          <br />
          사업장 소재지: 서울특별시 양천구 목동동로 270, 301동 705호 · 연락처:
          010-2314-6335
        </div>
      </div>
    </footer>
  );
}
