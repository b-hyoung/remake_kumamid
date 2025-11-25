import type { Metadata } from "next";
import './globals.css'
import Header from '../components/header'
import Footer from  '../components/footer'

type LayoutProps = {
  children : React.ReactNode
};

// 메타데이터 설정
export const metadata : Metadata = {
  title : "한국영상대학교 졸업작품",
  description : "한국영상대학교 졸업작품전 정식 웹 사이트입니다."
}

export default function Layout({children}: LayoutProps) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
      </head>
      <body>
        {/* 헤더 고정  */}
        <Header />
        {/* 본문  */}
        <main>{children}</main>
        {/* 푸터 고정  */}
        <Footer />
      </body>
    </html>
  );
}