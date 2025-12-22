"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { firebaseConfig } from '@/lib/firebaseConfig';
import type { FirebaseApp } from 'firebase/app';
import type { Database } from 'firebase/database';

// --- Types ---
interface Comment {
    id: string;
    name: string;
    content: string;
    timestamp: number;
}

// --- Helper ---
const timeAgo = (ms: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - ms) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}년 전`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}달 전`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}일 전`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}시간 전`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}분 전`;
    return "방금 전";
};

// --- Main Page Component ---
function ThanksToPageContent() {
    const searchParams = useSearchParams();
    const year = searchParams.get('year') || '2025';

    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const appRef = useRef<FirebaseApp | null>(null);
    const dbRef = useRef<Database | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [content, setContent] = useState('');
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        if (isFirebaseReady && dbRef.current) {
            const { ref, onValue } = (window as any).firebase.database;
            const commentsRef = ref(dbRef.current, `thanksComments/${year}`);
            
            const unsubscribe = onValue(commentsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const commentsArray: Comment[] = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).sort((a, b) => b.timestamp - a.timestamp);
                    setComments(commentsArray);
                } else {
                    setComments([]);
                }
            });
            return () => unsubscribe();
        }
    }, [isFirebaseReady, year]);

    const handleFirebaseReady = () => {
        const { initializeApp } = (window as any).firebase.app;
        const { getDatabase } = (window as any).firebase.database;
        
        if (appRef.current) return;

        try {
            const app = initializeApp(firebaseConfig, `thanksTo-${Date.now()}`);
            appRef.current = app;
            dbRef.current = getDatabase(app);
            setIsFirebaseReady(true);
        } catch (e) {
            console.error("Firebase initialization error:", e);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !password.trim() || !content.trim()) {
            alert("모든 입력란을 채워주세요.");
            return;
        }
        if (!dbRef.current) {
            alert("데이터베이스 연결에 실패했습니다.");
            return;
        }

        const { ref, push, set } = (window as any).firebase.database;
        const commentsRef = ref(dbRef.current, `thanksComments/${year}`);
        const newCommentRef = push(commentsRef);
        
        try {
            await set(newCommentRef, { name, password, content, timestamp: Date.now() });
            setName('');
            setPassword('');
            setContent('');
            setCharCount(0);
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("댓글 등록에 실패했습니다.");
        }
    };
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setContent(text);
        setCharCount(text.length);
    }

    const socialLinks = [
        { href: "https://www.instagram.com/creative_md_kuma?igsh=cnlidmlxeG92ajl4", src: "/img/icon/sns_in.png", alt: "Instagram" },
        { href: "https://www.youtube.com/@한국영상대영상디자인", src: "/img/icon/sns_yu.png", alt: "YouTube" },
        { href: "https://www.facebook.com/kuma.ads", src: "/img/icon/sns_fa.png", alt: "Facebook" },
        { href: "https://blog.naver.com/advertising2020", src: "/img/icon/sns_blog.png", alt: "Blog" },
        { href: "https://cafe.naver.com/kumaamd", src: "/img/icon/sns_cafe.png", alt: "Cafe" },
    ];

    return (
        <>
            <Script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js" strategy="lazyOnload" onReady={handleFirebaseReady} />
            <Script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js" strategy="lazyOnload" onReady={handleFirebaseReady} />
            
            <div className="flex-grow">
                <div className="bg-white text-black pt-20 pb-10">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="이름" maxLength={10} className="w-full md:w-1/5 p-3 border-none rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-black" />
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" maxLength={10} className="w-full md:w-1/5 p-3 border-none rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-black" />
                            <textarea value={content} onChange={handleContentChange} placeholder="여러분의 소중한 응원을 입력해주세요." maxLength={300} className="w-full md:w-3/5 p-3 border-none rounded-full bg-gray-100 text-sm resize-none" style={{height: '44px'}}></textarea>
                        </div>
                        <div className="flex justify-end items-center text-xs text-gray-400 px-2">
                            <button onClick={handleSubmit} className="bg-transparent text-black font-semibold py-2 rounded-md text-xs hover:text-gray-600">등록 →</button>
                        </div>

                        <div className="mt-8 space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="py-4 border-b border-gray-200 flex justify-between items-start gap-4">
                                    <p className="text-gray-800 text-sm flex-grow">{comment.content}</p>
                                    <div className="flex-shrink-0 text-right w-24">
                                        <p className="font-semibold text-sm truncate">{comment.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(comment.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='bg-black text-white py-10'>
                    <div className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center mb-10">
                        <div className="flex gap-3">
                            {socialLinks.map(link => (
                                <Link key={link.alt} href={link.href} target="_blank">
                                    <Image src={link.src} alt={link.alt} width={35} height={35} className="object-contain" />
                                </Link>
                            ))}
                        </div>
                        <p className="text-sm font-bold">한국영상대학교<span className="hidden md:inline"> </span>영상디자인학과</p>
                    </div>
                    
                     <div className="w-full max-w-6xl mx-auto px-4 text-left">
                        <h2 className="text-4xl font-bold mb-4">오시는 길</h2>
                        <div className="w-20 h-1 bg-white mb-10"></div>
                        <div className="aspect-video">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3208.7808707880617!2d127.20831697509897!3d36.462851586644426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ab60770993387%3A0x40f78f2307b1c072!2z7IS47KKF7Yq567OE7J6Q7LmY7IucIOyepeq1sOuptCDrjIDtlZnquLggMzAw!5e0!3m2!1sko!2skr!4v1749543347492!5m2!1sko!2skr"
                                className="w-full h-full border-0"
                                allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ThanksToPage() {
    return (
        <Suspense fallback={<div className="text-center py-40">페이지를 불러오는 중...</div>}>
            <ThanksToPageContent />
        </Suspense>
    );
}