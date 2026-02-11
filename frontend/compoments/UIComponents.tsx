"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

// --- Carousel Component ---

export function Carousel() {
  const slides = [
    {
      title: "Tinh Hoa",
      subtitle: "VĂN HỌC VIỆT",
      description: "Bước chân vào không gian lưu giữ tâm hồn và bản sắc dân tộc qua hàng thế kỷ hào hùng.",
      badge: "Kho tàng di sản",
      bg: "bg-library-hero",
      gradient: "from-yellow-300 via-orange-200 to-yellow-100"
    },
    {
      title: "Hồn Cốt",
      subtitle: "NGÀN NĂM VĂN HIẾN",
      description: "Khám phá những bản thảo cổ, những áng thơ bất hủ và tinh hoa tri thức của cha ông.",
      badge: "Ký ức lịch sử",
      bg: "bg-[url('/images/history-bg.png')]",
      gradient: "from-indigo-300 via-purple-200 to-indigo-100"
    },
    {
      title: "Cánh Cửa",
      subtitle: "TRI THỨC VÔ TẬN",
      description: "Nơi tri thức hòa quyện cùng nghệ thuật, mở ra tầm nhìn mới cho thế hệ tương lai.",
      badge: "Tương lai sáng ngời",
      bg: "bg-[url('/images/modern-lib.png')]",
      gradient: "from-emerald-300 via-teal-200 to-emerald-100"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full h-[32rem] lg:h-[42rem] relative rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl group border border-zinc-100 dark:border-zinc-800">
      {slides.map((slide, idx) => (
        <div 
          key={idx} 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === current 
              ? 'opacity-100 scale-100 z-10 visible' 
              : 'opacity-0 scale-95 z-0 invisible pointer-events-none'
          }`}
        >
          <div className={`absolute inset-0 bg-cover bg-center ${slide.bg}`}></div>
          {/* Immersive Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-zinc-950/30 backdrop-brightness-75"></div>

          {/* Floating Particle Effect */}
          <div className="absolute inset-0 opacity-20 contrast-125 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          
          <div className="relative h-full flex flex-col justify-center px-10 md:px-24 max-w-[1440px] mx-auto z-10 text-left pt-[180px] md:pt-[220px] pb-10">
            {/* Slide Title - Subtle Decorative Label */}
            <div className={`mb-4 transition-all duration-1000 ${idx === current ? 'animate-fadeIn delay-100' : ''}`}>
              <span className="text-[12px] md:text-[14px] font-black text-white/20 uppercase tracking-[0.8em] border-l-4 border-indigo-500/30 pl-4">
                {slide.title}
              </span>
            </div>
            {/* Main Subtitle - Hero Text */}
            <h2 
              data-font="serif"
              className={`text-[40px] md:text-[60px] lg:text-[72px] font-[1000] text-white mb-8 tracking-tight leading-[0.9] ${idx === current ? 'animate-slideUp [animation-delay:0.1s]' : ''}`}
            >
              <span className={`text-transparent bg-clip-text bg-gradient-to-br ${slide.gradient}`}>
                {slide.subtitle}
              </span>
            </h2>
            <p className={`text-[18px] md:text-[22px] text-zinc-200 max-w-2xl mb-10 font-semibold leading-relaxed drop-shadow-lg ${idx === current ? 'animate-fadeIn [animation-delay:0.4s]' : ''}`}>
              &ldquo;{slide.description}&rdquo;
            </p>

            <div className={`w-full max-w-2xl mb-12 flex items-center gap-6 ${idx === current ? 'animate-fadeIn [animation-delay:0.6s]' : ''}`}>
               <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-black tracking-[0.3em] rounded-lg">
                 {slide.badge}
               </span>
               <div className="h-px flex-1 bg-white/20"></div>
            </div>

            <div className={`flex items-center gap-10 ${idx === current ? 'animate-fadeIn [animation-delay:0.7s]' : ''}`}>
               <Link href="#explore" className="px-16 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-[14px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-white hover:text-zinc-900 transition-all">
                 Khám phá ngay
               </Link>
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 overflow-hidden relative">
                       <Image 
                          src={`https://i.pravatar.cc/100?img=${i+20}`} 
                          alt="user avatar" 
                          fill 
                          className="object-cover opacity-60" 
                       />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white">
                    +2K
                  </div>
               </div>
               <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Độc giả đang đọc</span>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            title={`Chuyển đến slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full ${i === current ? 'w-12 h-2.5 bg-indigo-500' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

      {/* Glass Navigation Controls */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <button 
           onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
           title="Slide trước"
           className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-indigo-600 transition-all pointer-events-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button 
           onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
           title="Slide tiếp theo"
           className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-indigo-600 transition-all pointer-events-auto"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

// --- LibraryDecorations Component ---

interface Particle {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
}

export function LibraryDecorations() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${7 + Math.random() * 10}s`,
    }));
    
    const timer = setTimeout(() => {
       setParticles(newParticles);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute w-1 h-1 bg-white/40 dark:bg-white/20 rounded-full animate-dust [left:${p.left}] [top:${p.top}] [animation-delay:${p.delay}] [animation-duration:${p.duration}]`}
        />
      ))}
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
    </div>
  );
}

// --- SearchBar Component ---

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative z-50">
      <div className={`flex items-center transition-all duration-500 overflow-hidden ${
        isExpanded ? 'w-64 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800' : 'w-10 bg-transparent border-transparent'
      } rounded-full`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Tìm kiếm"
          className={`p-2.5 rounded-full transition-all duration-500 ${
            isExpanded ? 'text-indigo-400' : 'text-inherit hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tra cứu sách..."
          className={`bg-transparent outline-none text-xs font-black uppercase tracking-widest text-white transition-all duration-500 ${
            isExpanded ? 'w-full px-2 opacity-100 pr-4' : 'w-0 opacity-0 pointer-events-none'
          }`}
          onBlur={() => !searchQuery && setIsExpanded(false)}
        />
      </div>
    </form>
  );
}
