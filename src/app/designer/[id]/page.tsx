"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// --- Types ---
interface Designer {
    name: string;
    profileComment: string;
    profileEmail: string;
    profileDream: string;
}
interface Project {
    type: 'poster' | 'video' | 'team';
    data: any;
}

// --- Reusable Components ---

const FallbackImage = ({ src, alt, className, layout = "fill" }: { src: string, alt: string, className?: string, layout?: "fill" | "intrinsic", width?: number, height?: number }) => {
    const [isError, setIsError] = useState(!src);
    useEffect(() => { setIsError(!src); }, [src]);

    if (isError) {
        return <div className={`bg-[#1e1e1e] w-full h-full flex items-center justify-center animate-shimmer ${className}`}><span className="text-sm font-medium text-gray-500">준비중...</span></div>;
    }
    return <Image src={src} alt={alt} className={className} layout={layout} objectFit="cover" unoptimized />;
};

const ProfileSection = ({ designer }: { designer: Designer }) => (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-8">Designer</h2>
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative w-60 h-80 md:w-72 md:h-96 rounded-lg overflow-hidden flex-shrink-0">
                <FallbackImage src="" alt={designer.name} className="" />
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold">{designer.name}</h1>
                <div className="mt-4">
                    <p className="inline-block bg-white/10 text-gray-200 px-3 py-1 rounded-md text-sm mb-2">{designer.profileDream}</p>
                    <p className="text-blue-300 bg-white/5 px-3 py-1 rounded-md text-sm">{designer.profileEmail}</p>
                </div>
            </div>
        </div>
        <hr className="border-gray-700 my-10" />
        <p className="text-center text-xl text-gray-300 italic">"{designer.profileComment}"</p>
        <hr className="border-gray-700 my-10" />
    </section>
);

const ProjectsGrid = ({ projects, year }: { projects: Project[], year: string }) => (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(({ type, data }) => {
                const link = `/works/${type}/${data.id}?year=${year}`;
                let title = '', typeText = '', subtext = '';

                if (type === 'poster') {
                    typeText = '포스터';
                    title = data.postName;
                } else if (type === 'video') {
                    typeText = '비디오';
                    title = data.postName;
                } else if (type === 'team') {
                    typeText = 'TVCF';
                    title = data.videoName;
                    subtext = data.teamMembers.join(', ');
                }

                return (
                    <Link key={`${type}-${data.id}`} href={link} className="group block rounded-lg overflow-hidden bg-[#111] hover:border-white border-2 border-transparent transition-all">
                        <div className="relative w-full aspect-video">
                            <FallbackImage src="" alt={title} />
                        </div>
                        <div className="p-4">
                            <p className="font-semibold text-yellow-500">{typeText}</p>
                            <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
                            {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
                        </div>
                    </Link>
                );
            })}
        </div>
    </section>
);

const OtherDesignersNav = ({ allDesigners, currentDesignerName, year }: { allDesigners: Designer[], currentDesignerName: string, year: string }) => {
    // ... (이전/다음 및 썸네일 로직) ...
    // 이 부분은 복잡도가 높으므로 UI만 간단히 구현합니다.
    return (
         <section className="w-full max-w-4xl mx-auto px-4 py-10 text-center">
            <h2 className="text-2xl text-gray-300 mb-6">다른 디자이너의 포트폴리오</h2>
            {/* 간단한 링크 목록으로 대체 */}
            <div className="flex flex-wrap justify-center gap-4">
                 {allDesigners.slice(0, 5).map(d => (
                     <Link key={d.name} href={`/designer/${d.name}?year=${year}`} className="text-gray-400 hover:text-white">{d.name}</Link>
                 ))}
            </div>
        </section>
    );
};

const CommentSection = () => (
    <section className="w-full max-w-4xl mx-auto px-4 py-10">
        <h3 className="text-xl font-bold mb-4">댓글</h3>
        <div className="bg-[#111] border border-gray-700 rounded-lg p-4">
            <div className="flex gap-4">
                <div className="text-3xl">👤</div>
                <div className="flex-grow space-y-3">
                    <input type="text" placeholder="이름" className="w-full bg-[#222] rounded-md p-2 border border-gray-600 focus:outline-none focus:border-yellow-500" />
                    <textarea placeholder="댓글을 입력해주세요." rows={4} className="w-full bg-[#222] rounded-md p-2 border border-gray-600 focus:outline-none focus:border-yellow-500"></textarea>
                    <div className="text-right">
                        <button className="bg-white text-black font-semibold px-6 py-2 rounded-md hover:bg-gray-200">등록</button>
                    </div>
                </div>
            </div>
        </div>
        {/* 댓글 목록 (기능 제외) */}
        <div className="mt-6 text-center text-gray-500">댓글 기능은 준비중입니다.</div>
    </section>
);


function DesignerDetailPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const year = searchParams.get('year') || '2025';

    const [designer, setDesigner] = useState<Designer | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [allDesigners, setAllDesigners] = useState<Designer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !year) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/data/${year}.json`);
                if (!res.ok) throw new Error("Data fetching failed");
                const data = await res.json();
                
                const foundDesigner = data.디자이너.find((d: Designer) => d.name === id);
                setDesigner(foundDesigner || null);
                setAllDesigners(data.디자이너 || []);

                if (foundDesigner) {
                    const foundProjects: Project[] = [];
                    data.포스트?.filter((p: any) => p.designerName === id).forEach((p: any) => foundProjects.push({ type: 'poster', data: p }));
                    data.비디오?.filter((v: any) => v.designerName.includes(id)).forEach((v: any) => foundProjects.push({ type: 'video', data: v }));
                    data.팀?.filter((t: any) => t.teamMembers.includes(id)).forEach((t: any) => foundProjects.push({ type: 'team', data: t }));
                    setProjects(foundProjects);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, year]);

    if (loading) return <div className="text-center py-40">Loading...</div>;
    if (!designer) return <div className="text-center py-40">해당 디자이너를 찾을 수 없습니다.</div>;

    return (
        <div className="flex-grow pt-12 md:pt-24 pb-10">
            <ProfileSection designer={designer} />
            <ProjectsGrid projects={projects} year={year} />
            <OtherDesignersNav allDesigners={allDesigners} currentDesignerName={designer.name} year={year} />
            <CommentSection />
        </div>
    );
}

export default function DesignerDetailPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <DesignerDetailPageContent />
        </Suspense>
    );
}
