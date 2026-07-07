const CONTACT_URL = "https://karma7000.github.io/zero-to-one-landing/contact.html";

// 토스페이먼츠 결제 연동(Task #8)과 함께 페이지에 삽입 예정인 안내 문구.
// 아직 결제가 붙지 않은 무료 단계에서는 사용하지 않습니다.
export default function PricingNotice() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl bg-cream p-5 text-xs leading-relaxed text-mute-text">
      <p className="mb-2">
        본 서비스는 AI의 실시간 웹 검색과 분석을 통해 리포트를 개별
        생성하며, 이 과정에서 실제 조사·연산 비용이 발생합니다. 이에 따라
        부득이하게 건당 20,000원의 이용료를 받고 있는 점 양해 부탁드립니다.
      </p>
      <p className="mb-2">
        결제 즉시 AI가 리포트를 생성하여 제공하는 디지털 콘텐츠 특성상,
        콘텐츠 제공이 완료된 이후에는 환불이 제한됩니다.
      </p>
      <p>
        리포트 생성 중 문제가 발생하거나 결과물에 대해 문의하실 사항이 있으면{" "}
        <a
          href={CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-navy underline"
        >
          문의하기
        </a>
        를 통해 언제든 연락해주세요.
      </p>
    </div>
  );
}
