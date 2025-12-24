import * as React from 'react';
import { introNav } from '@/constants/navData';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Video Background */}
      <div className='absolute inset-0 w-full h-full pointer-events-none'>
        <video
          className='w-full h-full object-cover'
          src="/video/2025.mp4"
          autoPlay loop muted playsInline
        />
        {/* Video Overlay */}
        <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>
      </div>
    
      {/* Navigation Content */}
      <div className='absolute top-1/2 left-[30%] -translate-y-1/2 z-10 flex flex-col gap-[30px] items-start text-white font-bold'>
        {introNav.map((item) => (
          <Link key={item.label} href={item.path} className='transition-colors duration-300 hover:text-gray-300 text-3xl md:text-4xl'>
            {item.label}
          </Link>
        ))}
      </div>    </div>
  );
}
