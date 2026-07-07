import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 해외진출 컨설팅 | Zero to One Company",
  description:
    "국가와 제품을 입력하면 AI가 해외진출 매력도, 이커머스/오프라인 채널, 사업성을 무료로 분석해드립니다. Zero to One Company 제공.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteNav />
        <main className="flex flex-1 flex-col pt-[68px]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
