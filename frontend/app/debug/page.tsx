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
import Reader from '@/page/Reader';
import News from '@/page/News';
import NewsDetail from '@/compoments/NewsDetail';
import About from '@/page/About';
import BookList from '@/compoments/BookList';

export default function CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Initial check deferred to next tick to avoid cascading render warning
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setIsOffline(true);
      }
    }, 0);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimeout(timer);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 px-6">
        <div className="text-center">
          <h1 className="text-9xl font-black text-zinc-100 dark:text-zinc-800 animate-pulse">OFFLINE</h1>
          <div className="relative -mt-20">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Mất kết nối Internet</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-md mx-auto">Vui lòng kiểm tra lại đường truyền internet.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none">Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  // Routing Logic
  if (slug.length === 0) return <Home />;
  if (slug[0] === 'login') return <Login />;
  if (slug[0] === 'register') return <Register />;
  if (slug[0] === 'search') return <Search />;
  if (slug[0] === 'borrow-history') return <BorrowHistory />;
  if (slug[0] === 'profile') return <Profile />;
  if (slug[0] === 'settings') return <Settings />;
  if (slug[0] === 'admin') return <Admin />;
  if (slug[0] === 'system-admin') return <SystemAdmin />;
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
                Kho sách di sản
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
  if (slug[0] === 'news' && slug[1]) return <NewsDetail id={slug[1]} />;
  if (slug[0] === 'news') return <News />;
  if (slug[0] === 'about') return <About />;

  // 404 Fallback
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-zinc-100 dark:text-zinc-800 animate-pulse">404</h1>
        <div className="relative -mt-20">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Ối! Trang không tồn tại</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-md mx-auto">Có vẻ như đường dẫn này đã bị lỗi hoặc không còn tồn tại.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none">Quay lại trang chủ</button>
        </div>
      </div>
    </div>
  );
}
