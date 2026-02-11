"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Image from 'next/image';
import { getApiUrl } from '@/hooks/useBooks';

interface BookContent {
    title: string;
    author: string;
    chapters: { title: string; content: string; image?: string }[];
    theme?: 'light' | 'dark' | 'sepia';
    fontSize?: number;
}

export default function Reader() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string[];
    const id = slug?.[1];

    const [content, setContent] = useState<BookContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
    const [fontSize, setFontSize] = useState(18);
    const [currentChapter, setCurrentChapter] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Mock Fetch Data (Replace with real API)
    useEffect(() => {
        if (!id) return;
        
        let mounted = true;

        const fetchContent = async () => {
             try {
                const response = await fetch(getApiUrl(`books/${id}/read`));
                if (!response.ok) {
                    throw new Error('Failed to load content');
                }
                const data = await response.json();
                if (mounted) {
                    setContent(data);
                    setLoading(false);
                }
             } catch (error) {
                console.error("Error fetching book content:", error);
                if (mounted) setLoading(false);
             }
        };

        fetchContent();

        return () => { mounted = false; };
    }, [id]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
    );

    if (!content) return null;

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans ${
            theme === 'dark' ? 'bg-zinc-950 text-zinc-300' : 
            theme === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : 
            'bg-white text-zinc-800'
        }`}>
            {/* Toolbar */}
            <div className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
                theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 
                theme === 'sepia' ? 'bg-[#f4ecd8]/90 border-[#e3d5b8]' : 
                'bg-white/90 border-zinc-100'
            }`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Go back">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="font-bold text-sm truncate max-w-[200px] md:max-w-md">{content.title}</h1>
                        <p className={`text-[10px] uppercase tracking-wider font-semibold ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {content.chapters[currentChapter].title}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Font Settings */}
                    <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-8 h-8 flex items-center justify-center text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">A-</button>
                        <span className="text-xs font-bold w-4 text-center">{fontSize}</span>
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-8 h-8 flex items-center justify-center text-lg font-medium hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">A+</button>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex gap-2 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <button onClick={() => setTheme('light')} className={`w-8 h-8 rounded-full border border-zinc-300 bg-white transition-all ${theme === 'light' ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`} title="Light"></button>
                        <button onClick={() => setTheme('sepia')} className={`w-8 h-8 rounded-full border border-[#e3d5b8] bg-[#f4ecd8] transition-all ${theme === 'sepia' ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`} title="Sepia"></button>
                        <button onClick={() => setTheme('dark')} className={`w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 transition-all ${theme === 'dark' ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`} title="Dark"></button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-[1440px] mx-auto flex gap-8 px-6 pt-44 pb-20">
                {/* Left Sidebar - Table of Contents */}
                <aside className="hidden lg:block w-72 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                    <div className="mb-6 px-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">Mục lục</h3>
                        <div className="space-y-1">
                            {content.chapters.map((chapter, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentChapter(index);
                                        scrollToTop();
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                                        currentChapter === index 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                                            : `hover:bg-black/5 dark:hover:bg-white/5 ${theme === 'dark' ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'}`
                                    }`}
                                >
                                    <span className="line-clamp-2">{chapter.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 max-w-4xl mx-auto">
                    <article ref={contentRef} className="prose max-w-none">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 block">
                                Chương {currentChapter + 1}
                            </span>
                            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
                                 theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
                            }`}>
                                {content.chapters[currentChapter].title}
                            </h2>
                            <div className={`h-1 w-20 bg-indigo-500 mx-auto rounded-full`}></div>
                        </div>

                        {content.chapters[currentChapter].image && (
                             <div className="my-12 relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl group">
                                <Image 
                                    src={content.chapters[currentChapter].image!.startsWith('http') 
                                        ? content.chapters[currentChapter].image! 
                                        : getApiUrl(content.chapters[currentChapter].image!)} 
                                    alt="Chapter illustration" 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                             </div>
                        )}

                        <div 
                            className={`whitespace-pre-line text-left space-y-8 selection:bg-indigo-500 selection:text-white [font-size:${fontSize}px] [line-height:2] [font-family:var(--font-merriweather),_serif]`}
                        >
                            {content.chapters[currentChapter].content}
                        </div>
                    </article>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-24 pt-10 border-t border-black/5 dark:border-white/5">
                         <button 
                            onClick={() => {
                                if (currentChapter > 0) {
                                    setCurrentChapter(prev => prev - 1);
                                    scrollToTop();
                                }
                            }}
                            disabled={currentChapter === 0}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                         >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                            Chương trước
                         </button>

                         <button 
                            onClick={() => {
                                if (currentChapter < content.chapters.length - 1) {
                                    setCurrentChapter(prev => prev + 1);
                                    scrollToTop();
                                }
                            }}
                            disabled={currentChapter === content.chapters.length - 1}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                         >
                            Chương tiếp theo
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                         </button>
                    </div>
                </main>

                {/* Right Sidebar - Book Stats / Progress */}
                <aside className="hidden xl:block w-72 sticky top-24 h-fit p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 px-1">Tiến trình đọc</h3>
                    <div className="space-y-6">
                        <div className="relative pt-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900/30">
                                    Tiến độ
                                </span>
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {Math.round(((currentChapter + 1) / content.chapters.length) * 100)}%
                                </span>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-200 dark:bg-indigo-900/20">
                                <div className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 w-[${((currentChapter + 1) / content.chapters.length) * 100}%]`}></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Tác giả:</span>
                                <span className="font-bold">{content.author}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Tổng chương:</span>
                                <span className="font-bold">{content.chapters.length}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
