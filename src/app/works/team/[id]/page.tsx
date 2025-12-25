"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { getTeamAssetUrl, getDesignerProfileImageUrl } from '@/lib/firebaseUtils';

// --- Types ---
interface TeamData {
    id: string;
    teamName: string;
    teamtitle?: string;
    teamfolder?: string;
    client: string;
    teamSubTitle: string;
    teamMembers: string[];
    mainImage: string;
    video: string;
    storyBord?: string[];
    memoRise?: string[];
    ['m-inner-text']?: string[];
    membersImg?: string;
    teamPPMNote?: string[];
    ['v-text']?: string;
    ['s-text']?: string;
    ['m-text']?: string;
    ['ppt-text']?: string;
}
interface Designer {
    name: string;
}

// --- Helper Functions ---
const getEmbedUrl = (url: string): string => {
    if (!url) return "";

    // YouTube: Convert watch?v= to embed/
    if (url.includes("youtube.com/watch?v=")) {
        return url.replace("watch?v=", "embed/");
    }
    
    // Vimeo: Convert vimeo.com/ to player.vimeo.com/video/
    if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
        const videoId = url.substring(url.lastIndexOf('/') + 1);
        return `https://player.vimeo.com/video/${videoId}`;
    }

    // If it's already a valid embed URL, return it as is.
    return url;
};

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

const DangerousHTML = ({ content, className }: { content: string, className?: string }) => {
    if (!content) return null;
    const sanitizedContent = content.replace(/\\n/g, '<br />');
    return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};


const Section = ({ title, children, condition }: { title: string, children: React.ReactNode, condition: boolean }) => {
    if (!condition) return null;
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>
            {children}
        </div>
    );
};

const AutoSlider = ({ images, overlayTexts, year, teamFolder }: { images: string[], overlayTexts?: string[], year: string, teamFolder: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-4xl mx-auto aspect-video">
            {images.map((imgFile, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <FallbackImage src={getTeamAssetUrl(year, teamFolder, imgFile)} alt={`Slide ${index + 1}`} fill className="rounded-lg object-contain" />
                    {overlayTexts?.[index] && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm p-2 rounded">
                            <DangerousHTML content={overlayTexts[index]} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const Carousel = ({ images, year, teamFolder }: { images: string[], year: string, teamFolder: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const prev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    const next = () => setCurrentIndex(prev => (prev + 1) % images.length);

    return (
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center gap-4">
            <button onClick={prev} className="ppm-btn">❮</button>
            <div className="w-full aspect-video relative">
                <FallbackImage src={getTeamAssetUrl(year, teamFolder, images[currentIndex])} alt={`PPM Note ${currentIndex + 1}`} fill className="rounded-lg object-contain" />
            </div>
            <button onClick={next} className="ppm-btn">❯</button>
        </div>
    );
};

function TeamViewPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const year = searchParams.get('year') || '2025';

    const [team, setTeam] = useState<TeamData | null>(null);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !year) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/data/${year}.json`);
                if (!res.ok) throw new Error("Data fetching failed");
                const data = await res.json();
                const foundTeam = data.팀.find((t: TeamData) => t.id === id);
                if (foundTeam) {
                    setTeam(foundTeam);
                    const foundDesigners = data.디자이너.filter((d: Designer) => foundTeam.teamMembers.includes(d.name));
                    setDesigners(foundDesigners);
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
    if (!team) return <div className="text-center py-40">해당 팀 정보를 찾을 수 없습니다.</div>;

    const teamFolder = team.teamfolder || team.teamName;

    return (
        <div className="flex-grow pb-10">
            {/* Hero Section */}
            <section className="relative w-full h-[550px] md:h-[650px] flex items-center">
                <div className="absolute inset-0">
                    <FallbackImage 
                        src={getTeamAssetUrl(year, teamFolder, team.mainImage)} 
                        alt={team.teamtitle || team.teamName} 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>
                
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-left">
                    <div className="max-w-2xl">
                        <p className="text-xl font-extrabold text-[#ffa647] mb-3">{`클라이언트 : ${team.client}`}</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tighter">
                            {team.teamtitle || team.teamName}
                        </h1>
                        <div className="text-md text-gray-200 mb-6">
                            <span className="font-semibold">Members:</span> {team.teamMembers.join(", ")}
                        </div>
                        <div className="text-lg text-gray-300 leading-relaxed">
                            <DangerousHTML content={team.teamSubTitle} />
                        </div>
                    </div>
                </div>
            </section>
            
            <Section title="" condition={!!team.video}>
                <div className="aspect-video w-full max-w-6xl mx-auto mt-16">
                    <iframe src={getEmbedUrl(team.video)} className="w-full h-full rounded-lg shadow-2xl" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
                </div>
                {team["v-text"] && <DangerousHTML content={team["v-text"]} className="mt-6 text-gray-400 max-w-4xl mx-auto" />}
            </Section>

            <Section title="Storyboard" condition={!!team.storyBord?.length}>
                <AutoSlider images={team.storyBord || []} year={year} teamFolder={teamFolder} />
                {team["s-text"] && <DangerousHTML content={team["s-text"]} className="mt-6 text-gray-400 max-w-4xl mx-auto" />}
            </Section>

            <Section title="Memorise" condition={!!team.memoRise?.length}>
                <AutoSlider images={team.memoRise || []} overlayTexts={team['m-inner-text']} year={year} teamFolder={teamFolder} />
                {team["m-text"] && <DangerousHTML content={team["m-text"]} className="mt-6 text-gray-400 max-w-4xl mx-auto" />}
            </Section>

            {team.membersImg && (
                <Section title="Members Image" condition>
                    <div className="max-w-3xl mx-auto relative aspect-video">
                        <FallbackImage
                            src={getTeamAssetUrl(year, teamFolder, team.membersImg)}
                            alt="Team members"
                            fill
                            className="rounded-lg object-contain"
                        />
                    </div>
                </Section>
            )}

            <Section title="Team PPM Note" condition={!!team.teamPPMNote?.length}>
                <Carousel images={team.teamPPMNote || []} year={year} teamFolder={teamFolder} />
                {team["ppt-text"] && <DangerousHTML content={team["ppt-text"]} className="mt-6 text-gray-400 max-w-4xl mx-auto" />}
            </Section>

            <Section title="Designers" condition={!!designers.length}>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                    {designers.map(designer => (
                        <Link key={designer.name} href={`/designerdetail?id=${encodeURIComponent(designer.name)}&year=${year}`} className="flex flex-col items-center gap-2 group">
                            <div className="relative w-60 md:h-80 group rounded-lg overflow-hidden">
                                <FallbackImage src={getDesignerProfileImageUrl(year, designer.name)} alt={designer.name} fill className="object-cover" />
                            </div>
                            <p className="font-semibold text-white group-hover:text-[#fabc11] mt-2">{designer.name}</p>
                        </Link>
                    ))}
                </div>
            </Section>
        </div>
    );
}

export default function TeamViewPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <TeamViewPageContent />
        </Suspense>
    );
}
