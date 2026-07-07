import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit은 내부적으로 __dirname 기준 상대경로로 기본 폰트(.afm) 파일을
  // 읽는데, 번들링되면 이 경로가 깨진다 - 번들링에서 제외해 실제 node_modules
  // 경로 그대로 require 되도록 한다.
  serverExternalPackages: ["pdfkit"],
  // PDF 생성 라우트가 런타임에 fs로 직접 읽는 폰트 파일이 서버리스 번들에
  // 확실히 포함되도록 명시한다 (자동 파일 추적이 놓칠 수 있는 케이스 대비).
  outputFileTracingIncludes: {
    "/api/reports/*/pdf": ["./lib/pdf/fonts/**/*"],
  },
};

export default nextConfig;
