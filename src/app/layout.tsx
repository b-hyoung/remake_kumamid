import type { Metadata } from "next";
import './globals.css';
import ClientLayout from './ClientLayout';
import { Suspense } from "react";

// 메타데이터 설정
export const metadata : Metadata = {
  title : "한국영상대학교 졸업작품",
  description : "한국영상대학교 졸업작품전 정식 웹 사이트입니다."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      {/* globals.css에서 body에 Pretendard 폰트와 기본 스타일이 적용되므로 head에서 추가적인 폰트 CDN 링크 및 스타일은 제거합니다. */}
      {/* Next.js 프로젝트의 기본 body 스타일은 globals.css에서 관리됩니다. */}
      <body>
        <Suspense>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}