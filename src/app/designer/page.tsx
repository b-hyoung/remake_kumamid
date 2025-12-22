"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { getDesignerProfileImageUrl } from '@/lib/firebaseUtils';

// --- Types ---
interface Designer {
    name: string;
    [key: string]: any;
}

// --- Reusable FallbackImage Component ---
const FallbackImage = (props: { src: string, alt: string, className?: string } & Omit<ImageProps, 'src' | 'alt'>) => {
    const { src, alt, className, ...rest } = props;
    const [isError, setIsError] = useState(!src);
    useEffect(() => { setIsError(!src); }, [src]);

    if (isError) {
        const placeholderClass = props.fill ? 'absolute inset-0' : '';
        return (
            <div className={`bg-[#1e1e1e] flex items-center justify-center animate-shimmer ${className} ${placeholderClass}`}>
                <span className="text-sm font-medium text-gray-500">준비중...</span>
            </div>
        );
    }

    return <Image src={src || ""} alt={alt} className={className} onError={() => setIsError(true)} unoptimized {...rest} />;
};


// --- Main Page Component ---
function DesignerPageContent() {
    const searchParams = useSearchParams();
    const year = searchParams.get('year') || '2025';

    const [designers, setDesigners] = useState<Designer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/data/${year}.json`);
                if (!res.ok) throw new Error("Data fetching failed");
                const data = await res.json();
                setDesigners(data.디자이너 || []);
            } catch (error) {
                console.error("Error fetching designer data:", error);
                setDesigners([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [year]);

    if (loading) return <div className="text-center py-40">Loading...</div>;
    if (designers.length === 0) return <div className="text-center py-40">디자이너 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="flex-grow py-12 md:py-24">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-8">디자이너 목록</h1>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
                    {designers.map(designer => (
                        <Link key={designer.name} href={`/designerdetail?id=${encodeURIComponent(designer.name)}&year=${year}`} className="group block text-center no-underline transition-transform duration-300 ease-in-out hover:scale-105">
                            <div className="relative w-full h-64 overflow-hidden rounded-lg bg-[#111]">
                                <div className="absolute inset-0 grayscale transition-all duration-500 group-hover:grayscale-0">
                                    <FallbackImage src={getDesignerProfileImageUrl(year, designer.name)} alt={`${designer.name} 프로필`} fill className="object-cover object-top" />
                                </div>
                            </div>
                            <h2 className="mt-4 text-base font-semibold text-gray-200">{designer.name}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DesignerPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <DesignerPageContent />
        </Suspense>
    );
}