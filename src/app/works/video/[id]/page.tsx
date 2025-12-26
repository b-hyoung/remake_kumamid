"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getVideoThumbnailUrl, getDesignerProfileImageUrl } from '@/lib/firebaseUtils';
import FallbackImage from '@/components/FallbackImage';

// --- Types ---
interface StillCut {
    img: string | string[];
    desc: string;
}

interface Video {
    id: string;
    designerName: string[];
    postName: string;
    client: string;
    clientDescription: string;
    videoDescription: string;
    vimeoId: string;
    videoThumb: string;
    stillCuts?: StillCut[];
}

interface Designer {
    name: string;
}

function VideoViewPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id as string;
    const year = searchParams.get('year') || '2025';

    const [video, setVideo] = useState<Video | null>(null);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [prevVideo, setPrevVideo] = useState<Video | null>(null);
    const [nextVideo, setNextVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !year) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/data/${year}.json`);
                if (!res.ok) throw new Error("Data fetching failed");
                const data = await res.json();
                
                const allVideos: Video[] = data.비디오 || [];
                const currentIndex = allVideos.findIndex((v: Video) => String(v.id) === String(id));

                if (currentIndex !== -1) {
                    const foundVideo = allVideos[currentIndex];
                    setVideo(foundVideo);

                    setPrevVideo(currentIndex > 0 ? allVideos[currentIndex - 1] : null);
                    setNextVideo(currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null);

                    const designerNames = Array.isArray(foundVideo.designerName) ? foundVideo.designerName : [foundVideo.designerName];
                    const foundDesigners = data.디자이너.filter((d: Designer) => designerNames.includes(d.name));
                    setDesigners(foundDesigners);
                } else {
                    setVideo(null);
                    setDesigners([]);
                }
            } catch (error) {
                console.error("Error fetching video data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, year]);
    
    const renderDescription = (htmlString: string) => {
        if (!htmlString) return null;
        return htmlString.split(/<br\s*\/?>/gi).map((line, index, arr) => (
            <React.Fragment key={index}>
                {line}
                {index < arr.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    if (loading) return <div className="text-center py-40">Loading...</div>;
    if (!video) return <div className="text-center py-40">해당 비디오를 찾을 수 없습니다.</div>;

    const primaryDesignerName = Array.isArray(video.designerName) ? video.designerName[0] : video.designerName;
    const arrowClass = "text-white text-4xl font-bold opacity-50 hover:opacity-100 transition-opacity";

    return (
        <div className="py-16">
            <div className="relative w-full h-[360px] md:h-[500px]">
                <FallbackImage src={getVideoThumbnailUrl(year, primaryDesignerName, video.videoThumb)} alt={video.postName || '프로젝트 대표 이미지'} fill className="object-cover" />
            </div>

            <section className="w-full max-w-4xl mx-auto px-6 py-10 md:py-16">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tighter">{video.postName}</h1>
                <p className="text-lg text-gray-400 mb-6">{`클라이언트 : ${video.client}`}</p>
                <hr className="border-gray-700 my-10" />
                <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                    <h2 className='text-xl text-white font-semibold mb-4'>Concept</h2>
                    <p>{renderDescription(video.clientDescription)}</p>
                </div>
                 <hr className="border-gray-700 my-10" />
                <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                     <h2 className='text-xl text-white font-semibold mb-4'>Visual Expression</h2>
                    <p>{renderDescription(video.videoDescription)}</p>
                </div>
            </section>

            <section className="w-full max-w-6xl mx-auto px-6 py-10">
                <div className="aspect-video w-full">
                    <iframe
                        src={video.vimeoId}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            {video.stillCuts && video.stillCuts.length > 0 && (
                <section className="w-full max-w-4xl mx-auto px-6 py-10">
                    <h1 className="text-4xl font-bold mb-8 text-center">Still Cut</h1>
                    <div className="space-y-12">
                        {video.stillCuts.map((cut, index) => (
                            <div key={index}>
                                 <div className="relative w-full aspect-video mb-4">
                                     <FallbackImage src={getVideoThumbnailUrl(year, primaryDesignerName, Array.isArray(cut.img) ? cut.img[0] : cut.img)} alt={`Still cut ${index + 1}`} fill className="rounded-lg object-cover" />
                                 </div>
                                 <p className="text-center text-gray-400">{renderDescription(cut.desc)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="text-center text-gray-500 text-sm mt-10">
                <div className="border-t border-gray-700 max-w-4xl mx-auto my-10"></div>
                <div className="w-full max-w-5xl mx-auto flex justify-center items-center px-4 gap-4">
                    {prevVideo ? (
                        <Link href={`/works/video/${prevVideo.id}?year=${year}`} className={arrowClass}>
                            &#10094;
                        </Link>
                    ) : (
                        <div className="w-10 h-10"></div> // Placeholder
                    )}
                    <div className="grow">
                        {designers.length === 1 ? (
                            <Link href={`/designerdetail?id=${encodeURIComponent(designers[0].name)}&year=${year}`} className="flex flex-col md:flex-row justify-center items-center gap-16 group">
                                <p className="text-4xl md:text-6xl font-extrabold text-white group-hover:text-[#fabc11] transition-colors order-2 md:order-1">{designers[0].name}</p>
                                <div className="relative w-60 h-80 md:w-80 md:h-[426px] order-1 md:order-2">
                                    <FallbackImage src={getDesignerProfileImageUrl(year, designers[0].name)} alt={designers[0].name || '디자이너 프로필'} fill className="rounded-lg object-cover" />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-4">
                                {designers.map(designer => (
                                    <Link key={designer.name} href={`/designerdetail?id=${encodeURIComponent(designer.name)}&year=${year}`} className="flex flex-col items-center gap-2 group">
                                        <div className="relative w-32 h-40 rounded-lg overflow-hidden">
                                            <FallbackImage src={getDesignerProfileImageUrl(year, designer.name)} alt={designer.name} fill className="object-cover" />
                                        </div>
                                        <p className="font-semibold text-white group-hover:text-[#fabc11] mt-2">{designer.name}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {nextVideo ? (
                        <Link href={`/works/video/${nextVideo.id}?year=${year}`} className={arrowClass}>
                            &#10095;
                        </Link>
                    ) : (
                        <div className="w-10 h-10"></div> // Placeholder
                    )}
                </div>
                <div className="border-t border-gray-700 max-w-4xl mx-auto my-10"></div>
            </section>
        </div>
    );
}

export default function VideoViewPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <VideoViewPageContent />
        </Suspense>
    );
}

