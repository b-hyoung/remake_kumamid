"use client"

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from  '../components/footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [isHome, setIsHome] = useState<boolean>(false);
  
  useEffect(() => {
    setIsHome(pathName === '/');
  }, [pathName]);

  // 헤더의 총 높이를 대략 90px (50px + 40px) 정도로 계산하고, mt-24 (6rem = 96px)로 여유를 줍니다.
  const mainContentMarginTop = pathName === "/" ? "" : "mt-20";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${mainContentMarginTop}`}>{children}</main>
      { !isHome && <Footer /> }
    </div>
  );
}