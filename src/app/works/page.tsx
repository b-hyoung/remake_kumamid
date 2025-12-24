"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { getPosterImageUrl, getVideoThumbnailUrl, getTeamAssetUrl } from '@/lib/firebaseUtils';

// --- Types ---
interface Post {
    id: string;
    designerName: string;
    postName: string;
    posterThumb: string;
}
interface Video {
    id: string;
    designerName: string | string[];
    thumbnail: string;
    postName: string;
}
interface Team {
    id: string;
    teamfolder: string;
    teamName: string;
    teamThumbnail: string;
    videoName: string;
}
interface FetchedData {
    디자이너: any[];
    포스트: Post[];
    비디오: Video[];
    팀: Team[];
}

// --- Components ---

const FallbackImage = (props: { src: string, alt: string, className?: string } & Omit<ImageProps, 'src' | 'alt'>) => {
    const { src, alt, className, ...rest } = props;
    const [isError, setIsError] = useState(!src);
    useEffect(() => { setIsError(!src); }, [src]);

    if (isError) {
        // fill 속성이 있을 때와 없을 때를 구분
        const isFill = !!props.fill;
        const placeholderClass = isFill ? 'absolute inset-0' : '';
        return (
            <div className={`bg-[#1e1e1e] w-full h-full flex items-center justify-center animate-shimmer ${className} ${placeholderClass}`}>
                <span className="text-sm font-medium text-gray-500">준비중...</span>
            </div>
        );
    }

    return <Image src={src || ""} alt={alt} className={className} onError={() => setIsError(true)} unoptimized {...rest} />;
};


const WorksGrid = ({ items, year, type }: { items: any[], year: string, type: string }) => {
    if (!items || items.length === 0) {
        return <div className="text-center col-span-full py-10">해당 연도의 작품이 없습니다.</div>;
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 justify-items-center">
            {items.map((item, index) => {
                let link = '', imageUrl = '', title = '', subtitle = '', category = '';

                if (type === 'post') {
                    link = `/works/post/${item.id}?year=${year}`;
                    imageUrl = getPosterImageUrl(year, item.designerName, item.posterThumb);
                    title = item.postName;
                    subtitle = item.designerName;
                    category = "포스터";
                } else if (type === 'video') {
                    link = `/works/video/${item.id}?year=${year}`;
                    const primaryDesigner = Array.isArray(item.designerName) ? item.designerName[0] : item.designerName;
                    imageUrl = getVideoThumbnailUrl(year, primaryDesigner, item.thumbnail);
                    title = item.postName;
                    subtitle = Array.isArray(item.designerName) ? item.designerName.join(", ") : item.designerName;
                    category = "비디오";
                } else if (type === 'team') {
                    link = `/works/team/${item.id}?year=${year}`;
                    imageUrl = getTeamAssetUrl(year, item.teamfolder || item.teamName, item.teamThumbnail);
                    title = item.videoName;
                    subtitle = item.teamName;
                    category = "TVCF";
                }

                return (
                    <Link href={link} key={`${type}-${item.id}-${index}`} className="group text-center no-underline w-full max-w-[240px]">
                        {/* `relative` 클래스 추가 */}
                        <div className="relative w-full h-[327px] bg-[#222] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                            <FallbackImage src={imageUrl} alt={title || '작품 썸네일'} fill className="rounded-lg object-cover" />
                        </div>
                        <h3 className="mt-3 text-[13px] font-medium text-gray-300 leading-tight">{category}</h3>
                        <h3 className="text-base font-semibold text-white mt-1"><span>{title}</span></h3>
                        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                    </Link>
                );
            })}
        </div>
    );
};

function WorksPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const year = searchParams.get('year') || '2025';
    const activeTab = searchParams.get('tab') || 'post';

    const [data, setData] = useState<FetchedData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorks = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/data/${year}.json`);
                if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다. 상태: ${response.status}`);
                const jsonData: FetchedData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("[fetch] 데이터 로딩 중 에러 발생:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchWorks();
    }, [year]);

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const renderContent = () => {
        if (loading) return <div className="text-center py-20">Loading...</div>;
        if (!data) return <div className="text-center py-20 text-red-500">데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.</div>;

        switch (activeTab) {
            case 'post': return <WorksGrid items={data.포스트} year={year} type="post" />;
            case 'video': return <WorksGrid items={data.비디오} year={year} type="video" />;
            case 'team': return <WorksGrid items={data.팀} year={year} type="team" />;
            default: return null;
        }
    };

    const tabs = [
        { id: 'post', label: '포스터' },
        { id: 'video', label: '비디오' },
        { id: 'team', label: 'TVCF (팀)' },
    ];

    return (
        <div className="flex-grow py-12 md:py-24">
            <div className="container mx-auto px-4">
                <header className="pb-8 text-left">
                    <h1 className="text-2xl font-bold mb-8">Works</h1>
                    <nav className="flex gap-6">
                        {tabs.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => handleTabChange(id)}
                                className={`relative bg-transparent border-none cursor-pointer tab-button-animation ${activeTab === id ? 'active' : ''}`}
                            >
                                <span className="text-[1.1rem] leading-none">{label}</span>
                            </button>
                        ))}
                    </nav>
                </header>

                <main className="mt-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default function WorksPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading Page...</div>}>
            <WorksPageContent />
        </Suspense>
    );
}