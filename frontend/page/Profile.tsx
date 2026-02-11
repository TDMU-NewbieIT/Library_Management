"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from '@/hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const {
      profile, stats, loading, isEditing, setIsEditing, editForm, setEditForm, handleUpdate, updateAvatar
  } = useProfile(user?.id);

  type TabType = 'overview' | 'history' | 'favorites' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const onSave = async () => {
    const result = await handleUpdate();
    if (result.success) {
        alert('Cập nhật thành công!');
        setIsEditing(false);
    } else {
        alert(result.message || 'Có lỗi xảy ra');
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Ảnh quá lớn (vui lòng chọn ảnh dưới 10MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input to allow same file selection
    e.target.value = '';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6">Bạn cần đăng nhập để xem hồ sơ</h2>
          <Link href="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 relative bg-library overflow-x-hidden">
      {/* Immersive Atmospheric Overlays (Outer Background) */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-zinc-950/80 via-zinc-950/20 to-transparent z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-white/40 dark:bg-black/40 z-0"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 pt-[80px]">
        <div className="!bg-white rounded-[40px] shadow-[0_32px_120px_-16px_rgba(0,0,0,0.1)] border border-zinc-100 p-10 mb-10 overflow-hidden relative group">
          {/* Flex Wrapper for Avatar and Info */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-8">
            {/* Avatar Section */}
            <div className="relative group/avatar shrink-0">
              <div className="w-40 h-40 rounded-[40px] bg-indigo-600 flex items-center justify-center text-white text-6xl font-black shadow-2xl overflow-hidden relative border-4 border-white dark:border-zinc-800">
                  {profile?.avatar ? (
                    <Image src={profile.avatar} alt={profile.name || "User"} fill className="object-cover" unoptimized />
                  ) : (
                    profile?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                  
                  {/* Always Visible Edit Button for all devices */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }}
                    title="Đổi ảnh đại diện"
                    className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 border-2 border-white dark:border-zinc-800 group/edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 012-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Photo Edit Overlay (Hover-only helper) */}
                  <div 
                    onClick={handleAvatarClick}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-[2px] z-10 hidden md:flex"
                  >
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Đổi ảnh</span>
                  </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                title="Tải lên ảnh đại diện"
                onChange={handleFileUpload}
              />
            </div>
            
            {/* Main Info */}
            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-3">
                    <h1 className="text-[42px] font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-1">
                        {profile?.name}
                    </h1>
                    <div className="mt-1">
                      <span className="px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black uppercase rounded-lg shadow-lg">
                          {profile?.role === 'admin' ? 'Quản trị viên' : profile?.role === 'librarian' ? 'Thủ thư' : 'Thành viên'}
                      </span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="text-[16px] font-bold text-zinc-500 dark:text-zinc-400">{profile?.email}</div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/20 w-fit px-5 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                     HỘI VIÊN TỪ: <span className="text-zinc-900 dark:text-white ml-2">{stats?.memberSince ? formatDate(stats.memberSince) : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                   {/* Avatar Presets Library */}
                   <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mr-2">
                     <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-2">Mẫu:</span>
                     {[1,2,3,4].map(i => (
                        <button 
                          key={i} 
                          title={`Chọn ảnh mẫu ${i}`}
                          onClick={() => updateAvatar(`https://i.pravatar.cc/150?img=${i+20}`)}
                          className="w-8 h-8 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:scale-110 active:scale-90 transition-all shadow-sm relative"
                        >
                           <Image 
                              src={`https://i.pravatar.cc/100?img=${i+20}`} 
                              alt={`Mẫu ${i}`} 
                              fill 
                              className="object-cover" 
                              unoptimized
                           />
                        </button>
                      ))}
                   </div>

                   <button
                    onClick={() => { setActiveTab('settings'); setIsEditing(true); }}
                    className="px-6 py-3 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                   >
                    Cài đặt hồ sơ
                   </button>
                </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 mb-8">
            {['overview', 'history', 'favorites', 'settings'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => { setActiveTab(tab as TabType); setIsEditing(tab === 'settings'); }}
                    className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                    {tab === 'overview' ? 'Tổng quan' : tab === 'history' ? 'Lịch sử' : tab === 'favorites' ? 'Yêu thích' : 'Cài đặt'}
                </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { count: stats?.totalBorrows, label: 'Tổng mượn', color: 'text-indigo-600' },
                                { count: stats?.currentBorrows, label: 'Đang mượn', color: 'text-blue-600' },
                                { count: stats?.favoriteCount, label: 'Yêu thích', color: 'text-pink-600' },
                                { count: stats?.booksRead, label: 'Đã đọc', color: 'text-green-600' }
                            ].map((s, i) => (
                                <div key={i} className="p-7 !bg-white rounded-2xl border border-zinc-100 transition-all hover:border-indigo-500/30 group">
                                    <div className={`text-[32px] font-black ${s.color} mb-1 group-hover:scale-105 transition-transform`}>{s.count || 0}</div>
                                    <div className="text-[12px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 !bg-white rounded-2xl border border-zinc-100">
                            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Giới thiệu</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                {profile?.bio || 'Chưa có thông tin giới thiệu.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 !bg-white rounded-3xl border border-zinc-100 shadow-sm">
                            <h3 className="font-black text-[20px] mb-6 text-zinc-900 dark:text-white uppercase tracking-tighter border-b border-zinc-100/50 dark:border-zinc-800/50 pb-4">Mục tiêu đọc sách</h3>
                            <div className="relative pt-1">
                                <div className="flex mb-4 items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-[32px] font-black text-indigo-600 leading-none">{stats?.booksRead || 0}</div>
                                        <div className="text-[16px] font-black text-zinc-300">/ {stats?.readingGoal || 12}</div>
                                    </div>
                                    <div className="text-[14px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-lg">
                                        {Math.round(((stats?.booksRead || 0) / (stats?.readingGoal || 12)) * 100)}%
                                    </div>
                                </div>
                                 <div 
                                    className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-zinc-100/50 dark:bg-zinc-800/50"
                                 >
                                    <div 
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ '--progress-width': `${Math.min(((stats?.booksRead || 0) / (stats?.readingGoal || 12)) * 100, 100)}%` } as React.CSSProperties}
                                    >
                                        <div className="w-[var(--progress-width)] h-full bg-inherit rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-4">Tiến độ hằng năm</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950/20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500 font-bold mb-4">Lịch sử mượn sách gần đây</p>
                    <Link href="/borrow-history" className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold transition-all hover:bg-zinc-800">
                        Xem chi tiết lịch sử
                    </Link>
                </div>
            )}

            {activeTab === 'favorites' && (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950/20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500 font-bold mb-4">Sách yêu thích của bạn</p>
                    <Link href="/my-books" className="px-6 py-2 bg-pink-600 text-white rounded-lg text-xs font-bold transition-all hover:bg-pink-700">
                        Đến kho sách cá nhân
                    </Link>
                </div>
            )}

            {activeTab === 'settings' && isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="space-y-6">
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <h4 className="font-bold text-zinc-800 dark:text-white uppercase text-xs mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Thông tin cơ bản</h4>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="pf-name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Họ và tên</label>
                                    <input
                                        id="pf-name"
                                        type="text"
                                        value={editForm.name}
                                        placeholder="Nhập họ và tên..."
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="pf-phone" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Số điện thoại</label>
                                        <input
                                            id="pf-phone"
                                            type="tel"
                                            value={editForm.phone}
                                            placeholder="Nhập số điện thoại..."
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pf-goal" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Mục tiêu (năm)</label>
                                        <input
                                            id="pf-goal"
                                            type="number"
                                            value={editForm.readingGoal}
                                            placeholder="12"
                                            onChange={(e) => setEditForm({...editForm, readingGoal: parseInt(e.target.value) || 12})}
                                            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="pf-address" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Địa chỉ</label>
                                    <input
                                        id="pf-address"
                                        type="text"
                                        value={editForm.address}
                                        placeholder="Nhập địa chỉ cư trú..."
                                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                        className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <label htmlFor="pf-bio" className="block font-bold text-zinc-800 dark:text-white uppercase text-xs mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Giới thiệu</label>
                            <textarea
                                id="pf-bio"
                                value={editForm.bio}
                                placeholder="Viết vài dòng giới thiệu về bản thân..."
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                rows={5}
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white text-sm resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={onSave} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">Lưu thay đổi</button>
                            <button onClick={() => { setIsEditing(false); setActiveTab('overview'); }} className="w-full py-3 bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold hover:bg-zinc-50 transition-all">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
