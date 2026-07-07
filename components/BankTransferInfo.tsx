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
        입금 후 아래 &quot;입금했어요, 확인 요청하기&quot; 버튼을 눌러주세요.
        확인되는 즉시 이 화면이 자동으로 리포트 생성 화면으로 넘어갑니다.
        (주문번호: <span className="font-semibold">{reportId}</span>)
      </p>
    </div>
  );
}
