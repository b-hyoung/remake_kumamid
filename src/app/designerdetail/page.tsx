"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { getDesignerProfileImageUrl, getPosterImageUrl, getVideoThumbnailUrl, getTeamAssetUrl } from '@/lib/firebaseUtils';

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

const ProfileSection = ({ designer, year }: { designer: Designer, year: string }) => (
    <section className="w-full px-[5%] md:px-[13%]">
        <h2 className="text-2xl font-bold mb-8">Designer</h2>
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-lg overflow-hidden flex-shrink-0">
                <FallbackImage src={getDesignerProfileImageUrl(year, designer.name)} alt={designer.name} fill className="object-cover object-top" />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left pb-4">
                <h1 className="text-4xl md:text-6xl font-bold">{designer.name}</h1>
                <div className="mt-4 flex flex-col items-center md:items-start gap-2">
                    <p className="inline-block bg-white/10 text-gray-200 px-3 py-1 rounded-md text-sm mb-2">{designer.profileDream}</p>
                    <p className="text-blue-300 bg-white/5 px-3 py-1 rounded-md text-sm">{designer.profileEmail}</p>
                </div>
            </div>
        </div>
        <hr className="border-gray-700 my-8" />
        <p className="text-center text-xl text-gray-300 italic">"{designer.profileComment}"</p>
        <hr className="border-gray-700 my-8" />
        <h1 className="text-3xl md:text-4xl font-bold text-left mt-8">Project</h1>
    </section>
);

const ProjectsGrid = ({ projects, year }: { projects: Project[], year: string }) => (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map(({ type, data }, index) => {
                            const link = `/works/${type}/${data.id}?year=${year}`;
                            const gridSpanClass = type === 'team' ? 'md:col-span-2' : '';
            
                            let title = '', typeText = '', subtext = '', imageUrl = '';
                            let typeTextColor = 'text-[#ff6666]';
            
                            if (type === 'poster') {
                                typeText = '포스터';
                                title = data.postName;
                                imageUrl = getPosterImageUrl(year, data.designerName, data.posterThumb);
                            }
                            else if (type === 'video') {
                                typeText = '비디오';
                                title = data.postName;
                                const primaryDesigner = Array.isArray(data.designerName) ? data.designerName[0] : data.designerName;
                                imageUrl = getVideoThumbnailUrl(year, primaryDesigner, data.thumbnail);
                            }
                            else if (type === 'team') {
                                typeText = 'TVCF';
                                title = data.teamName;
                                subtext = `팀원: ${data.teamMembers.join(', ')}`;
                                imageUrl = getTeamAssetUrl(year, data.teamfolder, data.teamThumbnail);
                            }
            
                            return (
                                <Link key={`${type}-${data.id}`} href={link} className={`group block rounded-lg overflow-hidden bg-[#0a0a0a] border-2 border-transparent transition-all duration-200 ease-in-out hover:border-white hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 ${gridSpanClass}`}>
                                    <div className="text-left mb-10">
                                        <p className={`font-semibold text-xl mb-2 ${typeTextColor} transition-all duration-300 group-hover:translate-x-[10px] group-hover:translate-y-[10px] `}>{typeText}</p>
                                        <h3 className="text-lg font-bold text-white mt-1 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-[10px] group-hover:mb-30 group-hover:translate-y-[10px] ">{title}</h3>
                                        {subtext && <p className="text-base text-gray-200 mt-1 transition-all duration-300 group-hover:text-gray-300 group-hover:translate-x-[10px] group-hover:translate-y-[10px] ">{subtext}</p>}
                                    </div>
                                    <div className={`relative w-full rounded-xl overflow-hidden ${index < 2 ? 'h-[550px]' : 'aspect-video'}`}>
                                        <FallbackImage src={imageUrl} alt={title} fill className="object-cover group-hover:animate-pan-zoom" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <Image src="/file.svg" alt="icon" width={24} height={24} className="absolute top-6 left-6" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}        </div>
    </section>
);

const OtherDesignersNav = ({ allDesigners, currentDesignerName, year }: { allDesigners: Designer[], currentDesignerName: string, year: string }) => {
    const currentIndex = allDesigners.findIndex(d => d.name === currentDesignerName);
    if (currentIndex === -1) return null;
    const getDesignerByIndex = (offset: number) => allDesigners[(currentIndex + offset + allDesigners.length) % allDesigners.length];
    
    const prevDesigner = getDesignerByIndex(-1);
    const nextDesigner = getDesignerByIndex(1);
    const thumbDesigners = [-2, -1, 1, 2].map(getDesignerByIndex);

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10 text-center">
            <h2 className="text-2xl text-gray-300 mb-6">다른 디자이너의 포트폴리오</h2>
            <div className="flex items-center justify-center gap-4">
                <Link href={`/designerdetail?id=${encodeURIComponent(prevDesigner.name)}&year=${year}`} className="text-4xl text-gray-500 hover:text-white transition-colors">❮</Link>
                 <div className="flex flex-wrap justify-center gap-2 sm:gap-4 flex-grow">
                    {thumbDesigners.map(d => (
                         <Link key={d.name} href={`/designerdetail?id=${encodeURIComponent(d.name)}&year=${year}`} className="w-[calc(50%-theme(spacing.2))] sm:w-[calc(33.33%-theme(spacing.4)/3)] md:w-36 aspect-[4/5] group">
                            <div className="relative w-full h-full rounded-md overflow-hidden border-2 border-gray-700 group-hover:border-white transition-all">
                                <FallbackImage src={getDesignerProfileImageUrl(year, d.name)} alt={d.name} fill className="object-cover" />
                            </div>
                            <p className="mt-2 text-sm text-gray-400 group-hover:text-white transition-colors">{d.name}</p>
                        </Link>
                    ))}
                </div>
                 <Link href={`/designerdetail?id=${encodeURIComponent(nextDesigner.name)}&year=${year}`} className="text-4xl text-gray-500 hover:text-white transition-colors">❯</Link>
            </div>
        </section>
    );
};

const CommentSection = () => (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10">
        <h3 className="text-xl font-bold mb-4">댓글</h3>
        <div className="bg-[#111] border border-gray-700 rounded-lg p-4">
            <div className="flex gap-4 items-start">
                <div className="text-3xl mt-2">👤</div>
                <div className="flex-grow space-y-3">
                    <input type="text" placeholder="이름" className="w-full md:w-1/3 bg-[#222] rounded-md p-2 border border-gray-600 focus:outline-none focus:border-yellow-500" />
                    <textarea placeholder="댓글을 입력해주세요." rows={4} className="w-full bg-[#222] rounded-md p-2 border border-gray-600 focus:outline-none focus:focus:border-yellow-500"></textarea>
                    <div className="text-right">
                        <button className="bg-white text-black font-semibold px-6 py-2 rounded-md hover:bg-gray-200">등록</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-6 text-center text-gray-500">댓글 기능은 준비중입니다.</div>
    </section>
);


function DesignerDetailPageContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
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
        <div className="flex-grow pt-12 md:pt-24">
            <ProfileSection designer={designer} year={year} />
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