import RequestForm from "@/components/RequestForm";
import UsageGuide from "@/components/UsageGuide";
import PricingNotice from "@/components/PricingNotice";
import ZeroToOneCta from "@/components/ZeroToOneCta";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section
        className="px-6 py-20 text-center text-white"
        style={{
          background:
            "linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 60%, #2a4ea3 100%)",
        }}
      >
        <p className="mb-4 text-[13px] font-bold tracking-[3px] text-light-text">
          ZERO TO ONE COMPANY · AI 해외진출 진단
        </p>
        <h1 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          AI 해외진출 컨설팅
        </h1>
        <p className="mx-auto max-w-xl text-[15.5px] text-light-text">
          진출하고 싶은 국가와 제품을 입력하면, AI가 해외진출 매력도·이커머스
          채널·오프라인 채널·사업성을 분석하고 구체적인 비즈니스 제안까지
          제공합니다.
        </p>
      </section>

      <section className="flex flex-1 flex-col items-center gap-10 bg-white px-6 py-16">
        <RequestForm />
        <UsageGuide />
        <PricingNotice />
        <ZeroToOneCta />
      </section>
    </div>
  );
}
