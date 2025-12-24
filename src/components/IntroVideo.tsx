"use client";

import { useSearchParams } from 'next/navigation';

export default function IntroVideo() {
    const searchParams = useSearchParams();
    const year = searchParams.get('year') || '2025';
    const videoSrc = year === '2023' ? "/video/2023.mp4" : "/video/2025_intro.mp4";

    return (
        <div className='absolute inset-0 w-full h-full pointer-events-none'>
            <video
                key={videoSrc} // key is important to force re-mount of video element
                className='w-full h-full object-cover'
                src={videoSrc}
                autoPlay loop muted playsInline
            />
            {/* Video Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>
        </div>
    );
}
