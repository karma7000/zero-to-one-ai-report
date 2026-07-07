interface BankTransferInfoProps {
  reportId: string;
  amount: number;
  companyName: string;
}

export default function BankTransferInfo({
  reportId,
  amount,
  companyName,
}: BankTransferInfoProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-navy/10 bg-cream p-6 text-sm">
      <p className="font-extrabold text-dark-text">계좌이체로도 결제할 수 있어요</p>
      <div className="flex flex-col gap-1 text-mute-text">
        <p>
          은행: <span className="font-semibold text-dark-text">농협</span>
        </p>
        <p>
          계좌번호:{" "}
          <span className="font-semibold text-dark-text">241033-56-084536</span>
        </p>
        <p>
          예금주: <span className="font-semibold text-dark-text">권성우</span>
        </p>
        <p>
          입금액:{" "}
          <span className="font-semibold text-dark-text">
            {amount.toLocaleString()}원
          </span>
        </p>
        <p>
          입금자명:{" "}
          <span className="font-semibold text-dark-text">{companyName}</span>{" "}
          (회사명으로 입금해주세요)
        </p>
      </div>
      <p className="text-xs text-mute-text">
        입금 후 아래 &quot;결제/리포트 문의하기&quot;로 주문번호(
        <span className="font-semibold">{reportId}</span>)와 함께 알려주시면
        확인 후 리포트 생성을 시작해드립니다.
      </p>
    </div>
  );
}
