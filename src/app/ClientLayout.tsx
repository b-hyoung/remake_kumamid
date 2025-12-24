"use client"

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from  '../components/footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [isHome, setIsHome] = useState<boolean>(false);
  const [isIntro, setIsIntro] = useState<boolean>(false);
  
  useEffect(() => {
    setIsHome(pathName === '/');
    setIsIntro(pathName === '/intro');
  }, [pathName]);

  const mainContentMarginTop = isHome || isIntro ? "" : "mt-20";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${mainContentMarginTop}`}>{children}</main>
      
      { !isHome && !isIntro && <Footer /> }
    </div>
  );
}