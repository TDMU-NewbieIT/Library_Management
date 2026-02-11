"use client";
import React from "react";
import { useNews } from "@/hooks/useBooks";
import { LibraryDecorations } from "./UIComponents";
import Link from "next/link";

interface NewsDetailProps {
    id: string;
}

export default function NewsDetail({ id }: NewsDetailProps) {
    const { news } = useNews();
    const item = news.find(n => n._id === id);

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-6">
                <div className="text-center">
                    <h1 className="text-6xl font-black text-zinc-100 dark:text-zinc-800 mb-6">404</h1>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Không tìm thấy bản tin</h2>
                    <Link href="/news" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">Quay lại danh sách</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 px-4 md:px-8">
            <LibraryDecorations />
            
            <article className="max-w-4xl mx-auto">
                <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-indigo-600 transition-colors mb-12">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16l-4-4m0 0l4-4m-4 4h18"/></svg>
                    Quay lại danh sách
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-600/20">
                            {item.type}
                        </span>
                        <span className="text-zinc-400 text-xs font-bold">{new Date(item.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    
                    <h1 data-font="serif" className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter italic leading-[0.95] mb-8">
                        {item.title}
                    </h1>

                    <div className="flex items-center gap-4 py-6 border-y border-zinc-100 dark:border-zinc-800/50">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">
                            {item.author?.[0] || 'A'}
                        </div>
                        <div>
                            <div className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">{item.author || 'Admin'}</div>
                            <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Tác giả bản tin</div>
                        </div>
                    </div>
                </header>

                {item.imageUrl && (
                    <div className="mb-16 rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-2xl">
                        <img src={item.imageUrl} className="w-full h-auto object-cover" alt={item.title} />
                    </div>
                )}

                <div className="prose prose-xl prose-zinc dark:prose-invert max-w-none">
                    <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed italic mb-12 border-l-4 border-indigo-600 pl-8">
                        {item.summary}
                    </p>
                    <div className="text-xl text-zinc-800 dark:text-zinc-200 leading-[1.8] font-medium whitespace-pre-line">
                        {item.content}
                    </div>
                </div>

                <footer className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center">
                        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Chia sẻ bản tin này</h4>
                        <div className="flex justify-center gap-4">
                            {['Facebook', 'Twitter', 'LinkedIn', 'Copy Link'].map(social => (
                                <button key={social} className="px-6 py-3 bg-white dark:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
}
