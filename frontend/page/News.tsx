"use client";
import React, { useState } from "react";
import { useNews } from "@/hooks/useBooks";
import { LibraryDecorations } from "@/compoments/UIComponents";
import Link from "next/link";
import Image from "next/image";

const ScholarlyAccents = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
        {/* Vintage Wax Seal */}
        <div className="absolute top-[10%] right-[15%] w-16 h-16 rounded-full bg-wax-seal rotate-12 animate-pulse opacity-80 z-20 hidden md:block" />
        
        {/* Archive Stamp */}
        <div className="absolute top-[45%] left-[-20px] archive-stamp z-20 hidden lg:block select-none">
            LH / ARCHIVE / {new Date().getFullYear()}
        </div>

        {/* Ink Splatter / Coffee Stain effect - simplified with CSS radial gradients */}
        <div className="absolute top-[70%] right-[10%] w-32 h-32 bg-zinc-200/20 dark:bg-indigo-900/5 rounded-full blur-3xl" />
    </div>
);

const DecorativeBooks = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        {/* Top Left Decoration */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
        
        {/* Floating Quills/Pens Icons */}
        <div className="absolute top-40 left-10 animate-dust delay-100">
            <svg className="w-12 h-12 text-indigo-500/30 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
        </div>

        {/* Middle Right Decoration */}
        <div className="absolute top-[40%] -right-20 w-[600px] h-[600px] bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-[150px]" />
    </div>
);

export default function NewsPage() {
    const { news } = useNews();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { id: "all", label: "Tất cả" },
        { id: "event", label: "Sự kiện" },
        { id: "notice", label: "Thông báo" },
        { id: "newbook", label: "Sách mới" }
    ];

    // Search and Filter Logic
    const DisplayNews = news
        .filter((item) => {
            const matchesFilter = filter === "all" || item.type === filter;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               item.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    const featuredNews = DisplayNews[0];
    const otherNews = DisplayNews.slice(1);



    return (
        <div className="relative min-h-screen bg-white dark:bg-zinc-950 pt-44 pb-20 px-4 md:px-8 overflow-hidden">
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-dot-grid" />
            
            <LibraryDecorations />
            <DecorativeBooks />
            <ScholarlyAccents />
            
            <div className="relative max-w-7xl mx-auto z-10">
                {/* Header Section - Library Journal Style */}
                <header className="mb-24 relative">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                        <div className="max-w-4xl">
                             <div className="flex items-center gap-4 mb-10 translate-x-1">
                                <span className="w-16 h-[1px] bg-zinc-300 dark:bg-zinc-800"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-600">The Scholarly Archive</span>
                            </div>
                            <h1 data-font="serif" className="text-7xl md:text-9xl font-black !text-zinc-900 dark:!text-white tracking-tighter italic leading-[0.9] mb-4">
                                NHỊP ĐẬP <br />
                                <span className="text-indigo-600 not-italic tracking-normal">VĂN HỌC</span>
                            </h1>
                            <p data-font="serif" className="text-zinc-400 dark:text-zinc-600 text-sm font-medium italic tracking-wide mt-6 border-l-2 border-indigo-600/30 pl-6">
                                Một ấn bản định kỳ lưu trữ các chuyển động, sự kiện và tri thức văn chương đương đại.
                            </p>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-end gap-10">
                             {/* Inspiration Widget - Refined Library Look */}
                            <div className="hidden xl:flex items-start gap-8 max-w-sm text-right">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/60">Journal Inspiration</p>
                                    <p data-font="serif" className="text-xl font-bold text-zinc-800 dark:text-zinc-200 leading-tight italic decoration-indigo-500/20 underline underline-offset-8 decoration-wavy">
                                        &ldquo;Văn học là nhịp thở của tâm hồn con người.&rdquo;
                                    </p>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">— Maxim Gorky</p>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm bg-white dark:bg-zinc-900/50">
                                    <svg className="w-6 h-6 text-indigo-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto">
                                <div className="relative group sm:w-80">
                                    <input 
                                        type="text"
                                        placeholder="Tra cứu bản tin..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-6 pr-12 py-4 bg-transparent border-b-2 border-zinc-100 dark:border-zinc-800 outline-none focus:border-indigo-600 transition-all text-sm font-bold tracking-tight"
                                    />
                                    <svg className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 ${
                                    filter === cat.id 
                                        ? "text-indigo-600 border-b-2 border-indigo-600" 
                                        : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </header>

                {DisplayNews.length > 0 ? (
                    <div className="space-y-32">
                        {/* FEATURED ENTRY */}
                        {featuredNews && (
                            <div className="relative group grid md:grid-cols-2 gap-16 items-center">
                                <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-2xl border-8 border-white dark:border-zinc-900">
                                    {featuredNews.imageUrl ? (
                                        <Image 
                                            src={featuredNews.imageUrl} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
                                            alt={featuredNews.title} 
                                            fill
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
                                             <div className="absolute inset-x-8 inset-y-8 border border-white/10 flex items-center justify-center">
                                                <span className="text-zinc-800 text-9xl font-black select-none">LH</span>
                                             </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 py-1 border-b border-indigo-600/30">Volume 01</span>
                                            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{new Date(featuredNews.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <h2 data-font="serif" className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white leading-[1.05] tracking-tighter italic">
                                            {featuredNews.title}
                                        </h2>
                                    </div>
                                    
                                    <p data-font="serif" className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-zinc-900 dark:first-letter:text-white">
                                        {featuredNews.summary || featuredNews.content}
                                    </p>

                                    <Link href={`/news/${featuredNews._id}`} className="group inline-flex items-center gap-6">
                                        <span className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                                            <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white group-hover:translate-x-2 transition-transform duration-500">Bản toàn văn</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ARCHIVE GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                            {otherNews.map((item) => (
                                <div key={item._id} className="group flex flex-col items-start text-left border-t border-zinc-100 dark:border-zinc-800/50 pt-10 relative">
                                    <div className="mb-8 w-full relative">
                                        <div className="aspect-[3/2] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                                            {item.imageUrl && (
                                                <Image src={item.imageUrl} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt={item.title} fill />
                                            )}
                                        </div>
                                        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-[8px] font-black uppercase tracking-tighter text-zinc-400 bg-dot-grid opacity-0 group-hover:opacity-100 transition-opacity">
                                            Entry
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500/80">
                                            <span>#{item.type}</span>
                                            <span className="w-1 h-[2px] bg-zinc-200"></span>
                                            <span className="text-zinc-400">{new Date(item.createdAt).getFullYear()}</span>
                                        </div>
                                        
                                        <h3 data-font="serif" className="text-2xl font-black text-zinc-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors italic">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-zinc-500 dark:text-zinc-500 text-[13px] leading-relaxed line-clamp-3">
                                            {item.summary || item.content}
                                        </p>

                                        <Link href={`/news/${item._id}`} className="block pt-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:text-indigo-600 transition-colors underline underline-offset-8 decoration-zinc-200 dark:decoration-zinc-800 hover:decoration-indigo-600">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-40 rounded-[3rem] border border-zinc-100 dark:border-zinc-900 bg-dot-grid opacity-60">
                         <h3 data-font="serif" className="text-2xl font-black text-zinc-300 uppercase tracking-widest italic">Kho lưu trữ trống</h3>
                        <p className="text-zinc-400 mt-2 text-sm font-medium">Archives are currently empty. Check back for future entries.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
