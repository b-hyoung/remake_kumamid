import * as React from 'react';
import { introNav } from '@/constants/navData';
import Link from 'next/link';
import Footer from '@/components/footer';
import IntroVideo from '@/components/IntroVideo';

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Video Background Component */}
      <IntroVideo />
    
      {/* Navigation Content */}
      <div className='absolute top-1/2 left-[30%] -translate-y-1/2 z-10 flex flex-col gap-[30px] items-start text-white font-bold'>
        {introNav.map((item) => (
          <Link key={item.label} href={item.path} className='transition-colors duration-300 hover:text-gray-300 text-3xl md:text-4xl'>
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* Footer - positioned absolutely at the bottom */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <Footer />
      </div>
    </div>
  );
}
