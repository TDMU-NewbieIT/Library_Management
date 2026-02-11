"use client";
import { useState, useEffect, use } from "react";
import Home from '@/page/Home';
import Login from '@/page/Login';
import Register from '@/page/Register';
import Search from '@/page/Search';
import BorrowHistory from '@/page/BorrowHistory';
import Profile from '@/page/Profile';
import Settings from '@/page/Settings';
import Admin from '@/page/Admin';
import SystemAdmin from '@/page/SystemAdmin';
import BookDetail from '@/compoments/BookDetail';
import MyBooks from '@/compoments/MyBooks';
import BookList from '@/compoments/BookList';
import News from '@/page/News';
import NewsDetail from '@/compoments/NewsDetail';
import About from '@/page/About';
import Reader from '@/page/Reader';

export default function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];

  if (slug.length === 0) return <Home />;
  
  if (slug[0] === 'login') return <Login />;
  if (slug[0] === 'register') return <Register />;
  if (slug[0] === 'search') return <Search />;
  if (slug[0] === 'history') return <BorrowHistory />;
  if (slug[0] === 'profile') return <Profile />;
  if (slug[0] === 'settings') return <Settings />;
  if (slug[0] === 'admin') return <Admin />;
  if (slug[0] === 'system-admin') return <SystemAdmin />;
  if (slug[0] === 'about') return <About />;
  if (slug[0] === 'news' && !slug[1]) return <News />;
  if (slug[0] === 'news' && slug[1]) return <NewsDetail id={slug[1]} />;
  if (slug[0] === 'books' && slug[1] && slug[2] === 'read') return <Reader />;
  if (slug[0] === 'books' && slug[1]) return <BookDetail />;
  if (slug[0] === 'my-books') return <MyBooks />;

  if (slug[0] === 'books' && !slug[1]) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 bg-library pt-32 pb-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="mb-12">
             <h1 data-font="serif" className="text-4xl font-black text-[var(--title-color)] mb-4 flex items-center gap-4 uppercase tracking-tighter">
                <span className="w-4 h-12 bg-indigo-600 rounded-sm"></span>
                KHO SÁCH LIỆU THÀNH
             </h1>
             <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Khám phá và mượn các tác phẩm văn học kinh điển</p>
          </div>
          <div className="bg-white/50 dark:bg-zinc-800/30 backdrop-blur-sm p-4 rounded-[2.5rem]">
            <BookList />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page Not Found</p>
    </div>
  );
}
