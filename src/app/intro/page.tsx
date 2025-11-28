import * as React from 'react';
import { introNav } from '@/constants/navData'; // yearData, footer가 안 쓰이면 제거
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* 1. absolute 대신 fixed 권장 (스크롤해도 배경 고정)
         2. -z-10, -z-20 중복 제거 -> -z-10 하나만 
         3. pointer-events-none 추가 (비디오가 클릭 막는 것 방지)
      */}
      <div className='fixed top-0 left-0 w-full h-screen -z-10 opacity-60 pointer-events-none'>
        <video
          className='w-full h-full object-cover' /* object-cover 필수: 영상 비율 유지 */
          src="/video/2025.mp4"
          autoPlay loop muted playsInline
        />
      </div>

      <div className='
        absolute top-1/2 left-[30%] -translate-y-1/2 z-10 
        flex flex-col gap-12 items-start 
        text-4xl text-white/80 font-semibold
        
        [&>a]:cursor-pointer
        [&>a]:transition-colors
        [&>a]:duration-300
        [&>a]:hover:text-white
      '>
        {introNav.map((item) => (
          <Link key={item.label} href={item.path}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}