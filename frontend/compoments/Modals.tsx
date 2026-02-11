/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getApiUrl } from '@/hooks/useBooks';

// --- BookModal Component ---

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function BookModal({ isOpen, onClose, onSuccess, initialData }: BookModalProps) {
    const [formData, setFormData] = useState({
        bookId: '',
        title: '',
        author: '',
        genre: '',
        imageUrl: '',
        contentSummary: '',
        stock: 1,
        totalQuantity: 1,
        isAvailable: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                bookId: initialData.bookId || '',
                title: initialData.title || '',
                author: initialData.author?.name || '',
                genre: initialData.genre || '',
                imageUrl: initialData.imageUrl || '',
                contentSummary: initialData.contentSummary || '',
                stock: initialData.stock ?? 1,
                totalQuantity: initialData.totalQuantity ?? 1,
                isAvailable: initialData.isAvailable ?? true
            });
        } else {
            setFormData({ bookId: '', title: '', author: '', genre: '', imageUrl: '', contentSummary: '', stock: 1, totalQuantity: 1, isAvailable: true });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                author: { name: formData.author }
            };

            const url = initialData
                ? getApiUrl(`books/${initialData.bookId}`)
                : getApiUrl('books');

            const method = initialData ? 'PUT' : 'POST';

            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
                if (!initialData) setFormData({ bookId: '', title: '', author: '', genre: '', imageUrl: '', contentSummary: '', stock: 1, totalQuantity: 1, isAvailable: true });
            } else {
                alert(initialData ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold dark:text-white">
                        {initialData ? 'Cập nhật thông tin sách' : 'Thêm sách mới'}
                    </h3>
                    <button onClick={onClose} title="Đóng" className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {!initialData && (
                        <div>
                            <label htmlFor="bookId" className="block text-sm font-medium mb-1 dark:text-zinc-300">Mã sách (ID)</label>
                            <input
                                id="bookId"
                                required
                                placeholder="VD: B001"
                                value={formData.bookId}
                                onChange={e => setFormData({ ...formData, bookId: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tên sách</label>
                        <input
                            id="title"
                            required
                            placeholder="Tên sách"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tác giả</label>
                        <input
                            id="author"
                            required
                            placeholder="Tên tác giả"
                            value={formData.author}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium mb-1 dark:text-zinc-300">Thể loại</label>
                            <input
                                id="genre"
                                placeholder="Thể loại"
                                value={formData.genre}
                                onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1 dark:text-zinc-300">URL ảnh bìa</label>
                            <input
                                id="imageUrl"
                                placeholder="Link ảnh"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium mb-1 dark:text-zinc-300">Giới hạn mượn/ngày</label>
                            <input
                                id="stock"
                                type="number"
                                min="0"
                                required
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="totalQuantity" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tổng số lượng</label>
                            <input
                                id="totalQuantity"
                                type="number"
                                min="1"
                                required
                                value={formData.totalQuantity}
                                onChange={e => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tóm tắt nội dung</label>
                        <textarea
                            id="summary"
                            rows={3}
                            placeholder="Mô tả ngắn gọn về sách"
                            value={formData.contentSummary}
                            onChange={e => setFormData({ ...formData, contentSummary: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {initialData && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                checked={formData.isAvailable}
                                onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isAvailable" className="text-sm font-medium dark:text-zinc-300">Sách có sẵn (cho mượn)</label>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-800 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            {loading ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Thêm sách')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- NewsModal Component ---

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function NewsModal({ isOpen, onClose, onSuccess, initialData }: NewsModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        author: 'Admin'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                summary: initialData.summary || '',
                content: initialData.content || '',
                imageUrl: initialData.imageUrl || '',
                author: initialData.author || 'Admin'
            });
        } else {
            setFormData({ title: '', summary: '', content: '', imageUrl: '', author: 'Admin' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const url = initialData
                ? getApiUrl(`news/${initialData._id}`)
                : getApiUrl('news');

            const method = initialData ? 'PUT' : 'POST';

            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
                if (!initialData) setFormData({ title: '', summary: '', content: '', imageUrl: '', author: 'Admin' });
            } else {
                alert(initialData ? 'Lỗi khi cập nhật tin' : 'Lỗi khi đăng tin');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold dark:text-white">
                        {initialData ? 'Cập nhật tin tức' : 'Đăng tin mới'}
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="newsTitle" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tiêu đề tin</label>
                        <input
                            id="newsTitle"
                            required
                            placeholder="Nhập tiêu đề tin tức"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="newsSummary" className="block text-sm font-medium mb-1 dark:text-zinc-300">Tóm tắt (hiện ở danh sách)</label>
                        <textarea
                            id="newsSummary"
                            rows={2}
                            required
                            placeholder="Mô tả ngắn gọn"
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="newsContent" className="block text-sm font-medium mb-1 dark:text-zinc-300">Nội dung chi tiết</label>
                        <textarea
                            id="newsContent"
                            rows={5}
                            required
                            placeholder="Nội dung đầy đủ của tin tức"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-800 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            {loading ? 'Đang xử lý...' : (initialData ? 'Cập nhật' : 'Đăng tin')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- ReportModal Component ---

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalUsers: number;
        totalBooks: number;
        activeBorrows: number;
        overdueBorrows: number;
    } | null;
}

export function ReportModal({ isOpen, onClose, stats }: ReportModalProps) {
    if (!isOpen) return null;

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    const genreData = [
        { name: 'Thơ Đường luật', value: 420 },
        { name: 'Truyện truyền kỳ', value: 350 },
        { name: 'Ngâm khúc', value: 280 },
        { name: 'Hát nói/Ca trù', value: 210 },
        { name: 'Văn tế', value: 160 },
    ];

    const growthData = [
        { month: 'T9', users: 45, books: 32 },
        { month: 'T10', users: 52, books: 41 },
        { month: 'T11', users: 38, books: 29 },
        { month: 'T12', users: 65, books: 54 },
        { month: 'T1', users: 48, books: 35 },
        { month: 'T2', users: 72, books: 58 },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20 relative animate-scaleUp">

                <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-zinc-800 dark:text-white flex items-center gap-3">
                            <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </span>
                            Báo cáo chi tiết hệ thống
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest font-bold">Cập nhật: {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}</p>
                    </div>
                    <button
                        onClick={onClose}
                        title="Đóng báo cáo"
                        className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 rounded-2xl transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Tỉ lệ mượn', value: '78%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Tăng trưởng', value: '+12.5%', color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Đánh giá TB', value: '4.8/5', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { label: 'Phản hồi', value: '96%', color: 'text-blue-600', bg: 'bg-blue-50' },
                        ].map((item, idx) => (
                            <div key={idx} className={`${item.bg} p-6 rounded-2xl border border-black/5`}>
                                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-1">{item.label}</div>
                                <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                            <h3 className="text-sm font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-wider">Tăng trưởng người dùng & sách</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="users" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={3} />
                                        <Area type="monotone" dataKey="books" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                            <h3 className="text-sm font-black text-zinc-800 dark:text-white mb-6 uppercase tracking-wider">Phân loại theo thể loại</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={genreData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={90} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                                            {genreData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8 mt-8">
                        <h3 className="text-lg font-black text-zinc-800 dark:text-white mb-6">Tóm lược hiệu suất</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</span>
                                    <span>Lượng độc giả nghiên cứu Thơ Đường luật trong tháng 2 tăng **20%**.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</span>
                                    <span>Tỉ lệ trả các bản sao quý hiếm (Truyện Truyền Kỳ) đúng hạn đạt **95%**.</span>
                                </li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">!</span>
                                    <span>Thể loại &quot;Hát nói&quot; cần bổ sung thêm các tư bản văn nhụ để phục vụ nhu cầu tra cứu.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">×</span>
                                    <span>Có {stats?.overdueBorrows || 0} tác phẩm cổ điển đang bị quá hạn lưu thông.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-zinc-50 dark:bg-zinc-800/80 mt-auto flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-zinc-500 flex items-center gap-2 italic">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Tài liệu này được tạo tự động bởi hệ thống Antigravity Library.
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-white rounded-2xl text-xs font-black shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            <span>In báo cáo</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
