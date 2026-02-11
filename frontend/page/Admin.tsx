"use client";

import { useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useAdminAuth, useAdminData, useAdminActions, User, News } from "@/hooks/useAdmin";
import { useActivityTracker } from "@/hooks/useAuth";
import { Book } from "@/hooks/useBooks";
import AdminLogin from "./AdminLogin";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { BookModal, NewsModal, ReportModal } from "@/compoments/Modals";

export default function Admin() {
  const { mounted, isAdminLoggedIn, currentUserRole, handleLogin, handleLogout } = useAdminAuth();
  
  const { 
    stats, users, books, borrows, news, setUsers, setBooks, setBorrows, setNews, fetchData 
  } = useAdminData(isAdminLoggedIn);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'borrows' | 'books' | 'news'>('dashboard');

  const {
    handleDeleteUser, handleDeleteBook, handleDeleteNews, handleRemindUser, handleReturnBook
  } = useAdminActions(setUsers, setBooks, setNews);

  // Activity tracking for the admin self
  useActivityTracker(isAdminLoggedIn ? '000000000000000000000000' : undefined);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const [userSearchText, setUserSearchText] = useState("");
  const [bookSearchText, setBookSearchText] = useState("");
  const [borrowSearchText, setBorrowSearchText] = useState("");
  const [newsSearchText, setNewsSearchText] = useState("");
  const [bookPage, setBookPage] = useState(1);
  const BOOKS_PER_PAGE = 10;

  const chartData = [
    { name: 'Tháng 9', value: 45 },
    { name: 'Tháng 10', value: 52 },
    { name: 'Tháng 11', value: 38 },
    { name: 'Tháng 12', value: 65 },
    { name: 'Tháng 1', value: 48 },
    { name: 'Tháng 2', value: 72 },
  ];

  const handleEditBook = (book: Book) => {
      setEditingBook(book);
      setShowBookModal(true);
  };

  const handleEditNews = (newsItem: News) => {
      setEditingNews(newsItem);
      setShowNewsModal(true);
  };

  if (!mounted) return null;

  if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-library pt-36 pb-12 px-4 text-zinc-800 dark:text-zinc-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-2">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700 mb-6">
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-1">
                      {currentUserRole === 'admin' ? 'Quản trị viên' : 'Thủ thư'}
                    </h2>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">
                       {currentUserRole === 'admin' ? 'System Administrator' : 'Librarian'}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-xs text-green-600 font-bold">Hệ thống Online</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>

                <nav className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                    >
                        📊 Tổng quan
                    </button>
                    <button 
                        onClick={() => setActiveTab('borrows')}
                        className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-colors ${activeTab === 'borrows' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                    >
                        🔄 Mượn trả
                    </button>
                    {/* Library Operations Section */}
                    <div className="space-y-4">
                        <div className="px-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-6">Vận hành</div>
                        {currentUserRole === 'admin' && (
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                            >
                                📚 Quản lý Độc giả
                            </button>
                        )}
                        <button 
                            onClick={() => setActiveTab('books')}
                            className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-colors ${activeTab === 'books' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                        >
                            📦 Kho sách
                        </button>
                        <button 
                            onClick={() => setActiveTab('news')}
                            className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-colors ${activeTab === 'news' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
                        >
                            📰 Bản tin
                        </button>
                    </div>


                    <Link 
                        href="/"
                        className="w-full text-left px-5 py-3 rounded-xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 mb-2 italic text-xs border border-zinc-200 dark:border-zinc-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Trang chủ (Thoát Quản lý)
                    </Link>
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
                {activeTab === 'dashboard' && stats && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                        {/* Stats Cards with Visual Enhancements */}
                        <div 
                            onClick={() => currentUserRole === 'admin' && setActiveTab('users')}
                            className={`bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 relative overflow-hidden group transition-all duration-300 ${currentUserRole === 'admin' ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : 'cursor-default'}`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12 text-zinc-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Người dùng</div>
                            <div className="text-3xl font-black text-zinc-800 dark:text-white">{stats.totalUsers}</div>
                            <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-zinc-800 dark:bg-white h-full w-[70%]"></div>
                            </div>
                        </div>
                        <div 
                            onClick={() => setActiveTab('books')}
                            className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
                            </div>
                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Tổng tác phẩm</div>
                            <div className="text-3xl font-black text-indigo-600">{stats.totalBooks}</div>
                            <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full w-[85%]"></div>
                            </div>
                        </div>
                        <div 
                            onClick={() => setActiveTab('borrows')}
                            className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
                            </div>
                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Đang lưu thông</div>
                            <div className="text-3xl font-black text-blue-600">{stats.activeBorrows}</div>
                             <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[40%]"></div>
                            </div>
                        </div>
                         <div 
                            onClick={() => setActiveTab('borrows')}
                            className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-300"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                            </div>
                            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Quá hạn trả</div>
                            <div className="text-3xl font-black text-red-500">{stats.overdueBorrows}</div>
                             <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[15%] text-transparent">15%</div>
                            </div>
                        </div>
                    </div>

                    {/* Animated Chart Section */}
                    <div className="mt-8 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 animate-fadeInUp">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-zinc-800 dark:text-white">Xu hướng mượn sách</h3>
                                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Thống kê 6 tháng gần nhất</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                    Lượt mượn
                                </span>
                            </div>
                        </div>
                        
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 700}}
                                        dy={15}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 700}}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#4f46e5" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-700 flex items-center justify-between text-[11px] text-zinc-400">
                           <div className="flex gap-4">
                               <span className="flex items-center gap-1 italic"><svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> +12% so với tháng trước</span>
                           </div>
                           <button 
                             onClick={() => setShowReportModal(true)}
                             className="text-indigo-600 font-bold hover:underline"
                           >
                             Xem báo cáo chi tiết →
                           </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 animate-fadeInUp delay-100">
                        {/* Borrowing Books Section (Sách đang được mượn) */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-zinc-800 dark:text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    Tác phẩm đang được mượn
                                </h3>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Đang lưu thông</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats.borrowingBooks && stats.borrowingBooks.length > 0 ? (
                                    stats.borrowingBooks.map((book: { title: string; saveCount: number }, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors group">
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center font-black text-indigo-600 border border-zinc-100 dark:border-zinc-700">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{book.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                                                        {book.saveCount} người mượn
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-8 text-center text-zinc-400 text-xs italic">Chưa có tác phẩm nào đang được mượn</div>
                                )}
                            </div>
                        </div>

                        {/* Overdue Users Section (Cảnh báo quá hạn) */}
                        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                                <h3 className="text-sm font-black text-red-500 mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    Cảnh báo quá hạn
                                </h3>
                                <div className="space-y-4">
                                    {stats.overdueUsers && stats.overdueUsers.length > 0 ? (
                                        stats.overdueUsers.map((user, idx) => (
                                            <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 group hover:scale-[1.02] transition-transform">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate pr-2">{user.userName}</h4>
                                                    <span className="text-[9px] font-black text-red-600 bg-red-50 px-1 rounded uppercase">Trễ hạn</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-2 truncate">Cuốn: {user.bookTitle}</p>
                                                <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400">
                                                    <span>Hạn trả: {new Date(user.dueDate).toLocaleDateString('vi-VN')}</span>
                                                    <button 
                                                        onClick={() => handleRemindUser(user.userName)}
                                                        className="text-indigo-600 hover:text-indigo-400 transition-colors uppercase"
                                                    >
                                                        Nhắc nhở
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-zinc-400 text-xs italic">Không có độc giả quá hạn</div>
                                    )}
                                </div>
                        </div>
                    </div>
                    </>
                )}



                {/* Tab Quản lý Độc giả (Thủ thư & Admin đều có quyền) */}
                {activeTab === 'users' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Quản lý Độc giả ({(Array.isArray(users) ? users : []).filter(u => u.role === 'user').length})</h3>
                                <p className="text-xs text-zinc-400">Theo dõi hoạt động mượn trả và nhắc nhở thành viên trả sách</p>
                            </div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Tìm tên hoặc email độc giả..." 
                                    value={userSearchText}
                                    onChange={(e) => setUserSearchText(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                                />
                                <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] text-zinc-400 uppercase font-black bg-zinc-50/30 dark:bg-zinc-900/10">
                                        <tr>
                                            <th className="px-6 py-3 w-12 text-center">STT</th>
                                            <th className="px-6 py-3">Độc giả</th>
                                            <th className="px-6 py-3">Liên hệ</th>
                                            <th className="px-6 py-3">Tình trạng mượn</th>
                                            <th className="px-6 py-3">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                        {(Array.isArray(users) ? users : []).filter((u: User) => u.role === 'user' && (u.name.toLowerCase().includes(userSearchText.toLowerCase()) || u.email.toLowerCase().includes(userSearchText.toLowerCase()))).map((u: User, idx: number) => (
                                            <tr key={u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors">
                                                <td className="px-6 py-4 text-center font-bold text-zinc-300">{idx + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-zinc-800 dark:text-zinc-200">{u.name}</div>
                                                        {u.isOnline ? (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 rounded-full">
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                                <span className="text-[8px] font-black text-green-600 uppercase">Online</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-500/10 rounded-full">
                                                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                                                                <span className="text-[8px] font-black text-zinc-500 uppercase">
                                                                    {u.lastActiveMinutes && u.lastActiveMinutes < 1440 
                                                                        ? `${u.lastActiveMinutes}p` 
                                                                        : 'Off'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-400 italic">Tham gia: {new Date(u.createdAt).toLocaleDateString('vi-VN')}</div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500 font-medium">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-blue-600">Đang mượn: {u.activeBorrows || 0}</span>
                                                        {u.overdueBorrows && u.overdueBorrows > 0 ? (
                                                            <span className="text-[10px] font-black text-red-500 animate-pulse">Quá hạn: {u.overdueBorrows} cuốn</span>
                                                        ) : (
                                                            <span className="text-[10px] font-medium text-zinc-400 italic">Hợp lệ</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    <button 
                                                        onClick={() => handleRemindUser(u.name)}
                                                        className={`p-1.5 rounded-lg transition-all ${u.overdueBorrows && u.overdueBorrows > 0 ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 shadow-sm' : 'text-zinc-300 opacity-50 cursor-not-allowed'}`}
                                                        title="Nhắc nhở trả sách"
                                                        disabled={!(u.overdueBorrows && u.overdueBorrows > 0)}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                                    </button>
                                                    {currentUserRole === 'admin' && (
                                                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors" title="Xóa độc giả">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'borrows' && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden animate-fadeIn">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Quản lý mượn trả ({borrows.length})</h3>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm tên người mượn hoặc tên sách..." 
                                        value={borrowSearchText}
                                        onChange={(e) => setBorrowSearchText(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                    {(Array.isArray(borrows) ? borrows : []).filter(b => b.status === 'borrowing').length} Đang mượn
                                </span>
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                    {(Array.isArray(borrows) ? borrows : []).filter(b => b.status === 'overdue').length} Quá hạn
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-4">Tác phẩm</th>
                                        <th className="px-6 py-4">Người mượn</th>
                                        <th className="px-6 py-4">Ngày mượn</th>
                                        <th className="px-6 py-4">Hạn trả</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                    {(Array.isArray(borrows) ? borrows : [])
                                        .filter(b => 
                                            b.bookTitle.toLowerCase().includes(borrowSearchText.toLowerCase()) || 
                                            (b.userId && typeof b.userId === 'object' && 'name' in b.userId && b.userId.name.toLowerCase().includes(borrowSearchText.toLowerCase()))
                                        )
                                        .map((b) => (
                                            <tr key={b._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200">{b.bookTitle}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-zinc-800 dark:text-zinc-300">
                                                            {(b.userId && typeof b.userId === 'object' && 'name' in b.userId) ? b.userId.name : 'Người dùng ẩn'}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400">
                                                            {(b.userId && typeof b.userId === 'object' && 'email' in b.userId) ? (b.userId as { email: string }).email : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500">{new Date(b.borrowDate).toLocaleDateString('vi-VN')}</td>
                                                <td className="px-6 py-4 text-zinc-500">
                                                    <span className={b.status === 'overdue' ? 'text-red-500 font-bold' : ''}>
                                                        {new Date(b.dueDate).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {b.status === 'borrowing' ? (
                                                        <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full text-[10px] font-black border border-blue-100 dark:border-blue-800 uppercase">Đang mượn</span>
                                                    ) : b.status === 'overdue' ? (
                                                        <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full text-[10px] font-black border border-red-100 dark:border-red-800 uppercase animate-pulse">Quá hạn</span>
                                                    ) : (
                                                        <span className="text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1 rounded-full text-[10px] font-black border border-zinc-100 dark:border-zinc-800 uppercase">Đã trả</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {b.status !== 'returned' && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleReturnBook(b._id, setBorrows)}
                                                                className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                                                                title="Thu hồi sách"
                                                            >
                                                                Thu hồi
                                                            </button>
                                                            {b.status === 'overdue' && (
                                                                <button 
                                                                    onClick={() => handleRemindUser((b.userId && typeof b.userId === 'object' && 'name' in b.userId) ? b.userId.name : 'Người dùng')}
                                                                    className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors border border-yellow-100"
                                                                    title="Gửi nhắc nhở"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'books' && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden animate-fadeIn">
                         <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Kho sách ({(Array.isArray(books) ? books : []).length})</h3>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm tên hoặc tác giả..." 
                                        value={bookSearchText}
                                        onChange={(e) => setBookSearchText(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setEditingBook(null); setShowBookModal(true); }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                            >
                                <span>+ Thêm sách</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-4 w-12 text-center">STT</th>
                                        <th className="px-6 py-4">Bìa</th>
                                        <th className="px-6 py-4">Tên tác phẩm</th>
                                        <th className="px-6 py-4">Tác giả</th>
                                        <th className="px-6 py-4">Giới hạn ngày</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                    {(() => {
                                        const filtered = (Array.isArray(books) ? books : []).filter((b: Book) => b.title.toLowerCase().includes(bookSearchText.toLowerCase()) || (b.author?.name || "").toLowerCase().includes(bookSearchText.toLowerCase()));
                                        const start = (bookPage - 1) * BOOKS_PER_PAGE;
                                        const current = filtered.slice(start, start + BOOKS_PER_PAGE);
                                        const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);

                                        return (
                                            <>
                                            {current.map((b: Book, idx: number) => (
                                                <tr key={b._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                                    <td className="px-6 py-4 text-center font-bold text-zinc-400">{start + idx + 1}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-8 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-md overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700 relative">
                                                            { b.imageUrl ? <NextImage src={b.imageUrl} fill className="object-cover" alt="" unoptimized /> : <span className="text-[8px] text-zinc-400 italic">No img</span> }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200 max-w-[270px] truncate">{b.title}</td>
                                                    <td className="px-6 py-4 text-zinc-500 max-w-[250px]">{b.author?.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-zinc-800 dark:text-zinc-200 font-bold">{b.stock ?? 0}</span>
                                                            <span className="text-[10px] text-zinc-400">Tổng: {b.totalQuantity ?? 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {b.isAvailable ? (
                                                            <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full text-[10px] font-black border border-green-100 dark:border-green-800 uppercase">Còn sách</span>
                                                        ) : (
                                                            <span className="text-red-500 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full text-[10px] font-black border border-red-100 dark:border-red-800 uppercase">Hết sách</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        <button onClick={() => handleEditBook(b)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-colors" title="Sửa">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                        </button>
                                                        <button onClick={() => handleDeleteBook(b._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors" title="Xóa">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filtered.length > BOOKS_PER_PAGE && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-700">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-zinc-500 font-medium">Trang {bookPage} / {totalPages} (Tổng {filtered.length} sách)</span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    disabled={bookPage === 1}
                                                                    onClick={() => setBookPage(prev => prev - 1)}
                                                                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-xs font-bold disabled:opacity-30"
                                                                >
                                                                    Trước
                                                                </button>
                                                                <button 
                                                                    disabled={bookPage === totalPages}
                                                                    onClick={() => setBookPage(prev => prev + 1)}
                                                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold disabled:opacity-30"
                                                                >
                                                                    Sau
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                 {activeTab === 'news' && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden animate-fadeIn">
                         <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Tin tức ({(Array.isArray(news) ? news : []).length})</h3>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm tiêu đề tin..." 
                                        value={newsSearchText}
                                        onChange={(e) => setNewsSearchText(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setEditingNews(null); setShowNewsModal(true); }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                            >
                                + Thêm tin
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-4 w-12 text-center">STT</th>
                                        <th className="px-6 py-4">Tiêu đề</th>
                                        <th className="px-6 py-4">Tác giả</th>
                                        <th className="px-6 py-4">Ngày đăng</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                    {(Array.isArray(news) ? news : []).filter((n: News) => n.title.toLowerCase().includes(newsSearchText.toLowerCase())).map((n: News, idx: number) => (
                                        <tr key={n._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                            <td className="px-6 py-4 text-center font-bold text-zinc-400">{idx + 1}</td>
                                            <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200">{n.title}</td>
                                             <td className="px-6 py-4 text-zinc-500">{n.author}</td>
                                             <td className="px-6 py-4 text-zinc-500">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => handleEditNews(n)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-colors" title="Sửa">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414 a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                                <button onClick={() => handleDeleteNews(n._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-colors" title="Xóa">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


            </div>
        </div>
      </div>
      
      {/* Modals */}
      <BookModal 
        isOpen={showBookModal} 
        onClose={() => setShowBookModal(false)}
        onSuccess={fetchData}
        initialData={editingBook}
      />
      
      <NewsModal 
         isOpen={showNewsModal}
         onClose={() => setShowNewsModal(false)}
         onSuccess={fetchData}
         initialData={editingNews}
      />

      <ReportModal 
         isOpen={showReportModal}
         onClose={() => setShowReportModal(false)}
         stats={stats}
      />
    </div>
  );
}
