"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPosterImageUrl, getDesignerProfileImageUrl } from '@/lib/firebaseUtils';
import FallbackImage from '@/components/FallbackImage';

// --- Types ---
interface Post {
    id: string;
    designerName: string;
    postName: string;
    client: string;
    clientDescription: string;
    subDescription: string;
    posterThumb: string;
    posterFile: string;
}

interface Designer {
    name: string;
}

function PostViewPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id as string;
    const year = searchParams.get('year') || '2025';

    const [post, setPost] = useState<Post | null>(null);
    const [designer, setDesigner] = useState<Designer | null>(null);
    const [prevPost, setPrevPost] = useState<Post | null>(null);
    const [nextPost, setNextPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !year) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/data/${year}.json`);
                if (!res.ok) throw new Error("Data fetching failed");
                const data = await res.json();
                
                const allPosts: Post[] = data.포스트 || [];
                const currentIndex = allPosts.findIndex((p: Post) => String(p.id) === String(id));

                if (currentIndex !== -1) {
                    const foundPost = allPosts[currentIndex];
                    setPost(foundPost);

                    setPrevPost(currentIndex > 0 ? allPosts[currentIndex - 1] : null);
                    setNextPost(currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null);

                    const foundDesigner = data.디자이너.find((d: Designer) => d.name === foundPost.designerName);
                    setDesigner(foundDesigner || null);
                } else {
                    setPost(null);
                    setDesigner(null);
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, year]);

    if (loading) return <div className="text-center py-40">Loading...</div>;
    if (!post || !designer) return <div className="text-center py-40">해당 포스트를 찾을 수 없습니다.</div>;

    const renderDescription = (htmlString: string) => {
        if (!htmlString) return null;
        return htmlString.split(/<br\s*\/?>/gi).map((line, index, arr) => (
            <React.Fragment key={index}>
                {line}
                {index < arr.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const arrowClass = "text-white text-4xl font-bold opacity-50 hover:opacity-100 transition-opacity";

    return (
        <div className="py-16">
            <div className="relative w-full h-[360px] md:h-[500px]">
                <FallbackImage src={getPosterImageUrl(year, designer.name, post.posterThumb)} alt={post.postName || '프로젝트 대표 이미지'} fill className="object-cover" />
            </div>

            <section className="w-full max-w-4xl mx-auto px-6 py-10 md:py-16">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tighter">{post.postName}</h1>
                <p className="text-lg text-gray-400 mb-6">{`클라이언트 : ${post.client}`}</p>
                
                <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                    <hr className="border-gray-700 my-6" />
                    <h2 className='text-xl text-white font-semibold'>Concept</h2>
                    <p>{renderDescription(post.clientDescription)}</p>
                    <hr className="border-gray-700 mt-6" />
                </div>
            </section>

            <div className="w-full max-w-4xl mx-auto px-6">
                 <div className="relative w-full" style={{paddingBottom: '75%'}}>
                    <FallbackImage src={getPosterImageUrl(year, designer.name, post.posterFile)} alt={`${post.postName} 상세 이미지`} fill className="rounded-lg object-contain" />
                </div>
            </div>

            <section className="w-full max-w-3xl mx-auto px-6 py-10 md:py-16 text-center">
                 <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                    <h2 className='text-xl text-white font-semibold'>Visual Expression</h2>
                    <p>{renderDescription(post.subDescription)}</p>
                </div>
            </section>

            <section className="text-center text-gray-500 text-sm">
                <div className="border-t border-gray-700 max-w-4xl mx-auto my-10"></div>
                 <div className="w-full max-w-5xl mx-auto flex justify-center items-center px-4 gap-4">
                    {prevPost ? (
                        <Link href={`/works/post/${prevPost.id}?year=${year}`} className={arrowClass}>
                            &#10094;
                        </Link>
                    ) : (
                        <div className="w-10 h-10"></div> // Placeholder
                    )}

                    <div className="grow">
                        <Link href={`/designerdetail?id=${encodeURIComponent(designer.name)}&year=${year}`} className="flex flex-col md:flex-row justify-center items-center gap-16 group">
                            <p className="text-4xl md:text-6xl font-extrabold text-white group-hover:text-[#fabc11] transition-colors order-2 md:order-1">{designer.name}</p>
                            <div className="relative w-60 h-80 md:w-80 md:h-[426px] order-1 md:order-2">
                                <FallbackImage src={getDesignerProfileImageUrl(year, designer.name)} alt={designer.name || '디자이너 프로필'} fill className="rounded-lg object-cover" />
                            </div>
                        </Link>
                    </div>

                    {nextPost ? (
                        <Link href={`/works/post/${nextPost.id}?year=${year}`} className={arrowClass}>
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

export default function PostViewPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <PostViewPageContent />
        </Suspense>
    );
}