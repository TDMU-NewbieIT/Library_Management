"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { SearchBar } from "@/compoments/UIComponents";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isSolidHeaderPage = ['/news', '/login', '/register', '/profile', '/about', '/my-books'].some(path => 
      pathname === path || pathname?.startsWith(path + '/')
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 20);
     };
     window.addEventListener("scroll", handleScroll);
     return () => window.removeEventListener("scroll", handleScroll);
   }, []);
 
   return (
    <>
     {/* Announcement Banner - Part of the Header system */}
     {(!isScrolled && !isSolidHeaderPage) && (
       <div className="fixed top-0 w-full bg-indigo-600 text-white py-2 px-4 text-center text-[13px] font-bold uppercase tracking-[0.2em] z-[1100] shadow-lg">
         <span className="animate-pulse">📢 Thông báo:</span> Thư viện mở cửa xuyên Tết Nguyên Đán phục vụ bạn đọc • <Link href="#" className="underline hover:text-indigo-200">Xem chi tiết</Link>
       </div>
     )}
 
     <header className={`fixed w-full z-[1000] transition-all duration-700 border-b ${
       (isScrolled || isSolidHeaderPage)
         ? "top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-zinc-200/50 dark:border-zinc-800/30 py-0 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]" 
         : "top-[36px] bg-transparent border-transparent py-4 text-white"
     }`}>
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-5 group">
          <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden ${
            (isScrolled || isSolidHeaderPage)
              ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 scale-90" 
              : "bg-white/10 backdrop-blur-3xl border border-white/20 hover:bg-white/20"
          }`}>
             {/* Subtle internal gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 font-black text-2xl tracking-tighter italic">L</span>
          </div>
          <div className="flex flex-col -gap-1 translate-y-0.5">
            <h1 className={`text-[22px] font-black tracking-tighter transition-all duration-500 leading-none ${
              (isScrolled || isSolidHeaderPage) ? "text-zinc-900 dark:text-white" : "text-white"
            }`}>
              LITERARY<span className="text-indigo-500 italic">HUB</span>
            </h1>
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-500 opacity-70 ${
              (isScrolled || isSolidHeaderPage) ? "text-zinc-500" : "text-white/60"
            }`}>
              Scholarly Archive
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-10">
          <nav className={`hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
            (isScrolled || isSolidHeaderPage) ? "text-zinc-500 dark:text-zinc-400" : "text-white/80"
          }`}>
             {[
               { name: "Trang chủ", href: "/" },
               { name: "Kho sách", href: "/#catalog" },
               { name: "Tin tức", href: "/news" },
               { name: "Giới thiệu", href: "/about" }
             ].map((item) => (
               <Link 
                 key={item.href} 
                 href={item.href} 
                 className={`relative py-2 hover:text-indigo-500 dark:hover:text-white transition-all duration-300 group/nav ${
                   pathname === item.href ? "text-indigo-600 dark:text-white" : ""
                 }`}
               >
                 {item.name}
                 <span className={`absolute bottom-0 left-0 h-[2px] bg-indigo-500 transition-all duration-500 ${
                   pathname === item.href ? "w-full" : "w-0 group-hover/nav:w-full"
                 }`} />
               </Link>
             ))}
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 active:scale-90 relative overflow-hidden group/theme ${
                  (isScrolled || isSolidHeaderPage) 
                    ? "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" 
                    : "text-white/80 hover:bg-white/10"
                }`}
                title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/theme:opacity-100 transition-opacity" />
                {theme === 'dark' ? (
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                ) : (
                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                )}
            </button>

            <SearchBar />
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 p-1.5 rounded-full pr-4 transition-all border ${
                  (isScrolled || isSolidHeaderPage)
                    ? "hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-100 dark:border-zinc-800" 
                    : "hover:bg-white/10 border-white/10"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden relative">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" unoptimized />
                  ) : (
                    user?.name?.[0] || 'U'
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-[13px] font-black leading-tight ${(isScrolled || isSolidHeaderPage) ? "text-zinc-900 dark:text-white" : "text-white"}`}>{user?.name}</p>
                  <p className={`text-[10px] font-bold ${(isScrolled || isSolidHeaderPage) ? "text-zinc-400" : "text-white/70"}`}>
                    {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'librarian' ? 'Thủ thư' : 'Bạn đọc'}
                  </p>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${(isScrolled || isSolidHeaderPage) ? "text-zinc-400" : "text-white/60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
 
               {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 py-3 z-[1001] animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="px-5 py-3 border-b border-zinc-50 dark:border-zinc-800 mb-2">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Tài khoản</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user?.email}</p>
                  </div>
                  
                  <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Hồ sơ của tôi
                  </Link>

                  <Link href="/my-books" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    Kho sách cá nhân
                  </Link>

                  {user?.role === 'librarian' && (
                    <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Trang Thủ thư
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        Quản lý Thư viện
                      </Link>
                      <Link href="/system-admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                        Quản lý Hệ thống
                      </Link>
                    </>
                  )}
                  
                  <div className="h-[1px] bg-zinc-50 dark:bg-zinc-800 my-2 mx-5" />
                  
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-100 dark:shadow-none"
                >
                  Đăng nhập
                </Link>
              </div>
           )}

           <button 
             onClick={() => {
               setIsMobileMenuOpen(!isMobileMenuOpen);
               setIsUserMenuOpen(false);
             }} 
             title="Mở menu điều hướng"
             aria-label="Menu"
             className={`lg:hidden p-2.5 rounded-xl transition-all ${
               (isScrolled || isSolidHeaderPage) ? "text-zinc-600 dark:text-zinc-400" : "text-white"
             }`}
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
             </svg>
           </button>
         </div>
       </div>
 
       {/* Mobile Navigation Drawer */}
       {isMobileMenuOpen && (
         <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 py-6 px-8 animate-in slide-in-from-top-4 duration-500 shadow-2xl z-[999]">
           <nav className="flex flex-col gap-6">
             {[
               { name: "Trang chủ", href: "/" },
               { name: "Kho sách", href: "/#catalog" },
               { name: "Tin tức", href: "/news" },
               { name: "Giới thiệu", href: "/about" }
             ].map((item) => (
               <Link 
                 key={item.href}
                 href={item.href} 
                 onClick={() => setIsMobileMenuOpen(false)} 
                 className={`text-sm font-black uppercase tracking-[0.2em] border-l-2 pl-4 transition-all ${
                   pathname === item.href ? "text-indigo-600 border-indigo-600" : "text-zinc-400 border-transparent"
                 }`}
               >
                 {item.name}
               </Link>
             ))}
           </nav>
         </div>
       )}
     </header>
    </>
   );
 }
