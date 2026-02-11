"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Book } from "./useBooks";
import { getApiUrl } from "./useBooks";

// --- Types ---

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    activeBorrows?: number;
    overdueBorrows?: number;
    isOnline?: boolean;
    lastActiveMinutes?: number;
}

export interface Borrow {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    } | string;
    bookId: string;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'borrowing' | 'returned' | 'overdue';
    fee: number;
    lateFee: number;
}

export interface AdminStats {
    totalUsers: number;
    totalBooks: number;
    activeBorrows: number;
    overdueBorrows: number;
    revenue: number;
    borrowingBooks?: Array<{ bookId: string; title: string; saveCount: number }>;
    overdueUsers?: Array<{ userName: string; userEmail: string; bookTitle: string; dueDate: string }>;
}

export interface News {
    _id: string;
    title: string;
    content?: string;
    summary: string;
    category?: string;
    createdAt: string;
    author: string;
    imageUrl?: string;
}

export interface LogEntry {
    _id: string;
    timestamp: string;
    user: string;
    userId?: string;
    action: string;
    category?: 'AUTH' | 'BOOK' | 'USER' | 'NEWS' | 'ADMIN';
    detail: string;
    status?: 'SUCCESS' | 'FAILURE';
    role?: string;
}

// --- Hooks ---

/**
 * Hook quản lý trạng thái đăng nhập và vai trò của Admin
 */
export const useAdminAuth = () => {
    const [mounted, setMounted] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'librarian' | 'user'>('user');

    // Initialize router
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            
            // Check for specific admin session OR main session with high role
            const adminSession = localStorage.getItem('admin_session') === 'true';
            const token = localStorage.getItem('token');
            const mainUserRaw = localStorage.getItem('user');
            
            let role: 'admin' | 'librarian' | 'user' = 'user';
            let isLoggedIn = false;

            if (token) {
                // Try to derive from main session first
                if (mainUserRaw) {
                    try {
                        const mainUser = JSON.parse(mainUserRaw);
                        if (mainUser.role === 'admin' || mainUser.role === 'librarian') {
                            role = mainUser.role;
                            isLoggedIn = true;
                        }
                    } catch (e) {
                        console.error("Failed to parse main user data", e);
                    }
                }
                
                // Fallback to specific admin keys if main session check didn't pass or was ambiguous
                if (!isLoggedIn && adminSession) {
                    role = (localStorage.getItem('admin_role') as 'admin' | 'librarian' | 'user') || 'user';
                    isLoggedIn = true;
                }
            }

            setIsAdminLoggedIn(isLoggedIn);
            setCurrentUserRole(role);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (role: 'admin' | 'librarian' = 'admin') => {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_role', role);
        setIsAdminLoggedIn(true);
        setCurrentUserRole(role);
        
        // Redirect based on role
        if (role === 'admin') {
            router.push('/system-admin');
        } else {
            router.push('/admin');
        }
    };

    const handleLogout = () => {
        // 1. Remove all storage keys
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 2. Clear state
        setIsAdminLoggedIn(false);
        
        // 3. FORCE RELOAD to clear all React states/memory
        // This is critical to prevent data from previous sessions persisting
        window.location.reload();
    };

    return {
        mounted,
        isAdminLoggedIn,
        currentUserRole,
        handleLogin,
        handleLogout
    };
};

/**
 * Hook quản lý dữ liệu tổng quan cho trang Admin
 */
export const useAdminData = (isAdminLoggedIn: boolean) => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [borrows, setBorrows] = useState<Borrow[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isAdminLoggedIn) {
             // CRITICAL: Clear strict data if not logged in to prevent leaks
             setStats(null);
             setUsers([]);
             setBooks([]);
             setBorrows([]);
             setNews([]);
             return;
        }
        
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const [statsRes, usersRes, booksRes, newsRes, borrowsRes] = await Promise.all([
                fetch(getApiUrl("admin/stats"), {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(getApiUrl("admin/users"), {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(getApiUrl("books")),
                fetch(getApiUrl("news")),
                fetch(getApiUrl("borrows"), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const [statsData, usersData, booksData, newsData, borrowsData] = await Promise.all([
                statsRes.ok ? statsRes.json() : null,
                usersRes.ok ? usersRes.json() : [],
                booksRes.ok ? booksRes.json() : [],
                newsRes.ok ? newsRes.json() : [],
                borrowsRes.ok ? borrowsRes.json() : []
            ]);

            if (statsData) setStats(statsData);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setBooks(Array.isArray(booksData) ? booksData : []);
            setNews(Array.isArray(newsData) ? newsData : []);
            setBorrows(Array.isArray(borrowsData) ? borrowsData : []);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            setUsers([]); setBooks([]); setNews([]); setBorrows([]);
        } finally {
            setLoading(false);
        }
    }, [isAdminLoggedIn]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats, users, books, borrows, news, loading,
        setUsers, setBooks, setNews, setBorrows, fetchData
    };
};

/**
 * Hook chứa các nghiệp vụ xử lý dữ liệu (Hành động) của Admin
 */
export const useAdminActions = (
    setUsers: React.Dispatch<React.SetStateAction<User[]>>,
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>,
    setNews: React.Dispatch<React.SetStateAction<News[]>>,
    setAuditLogs?: React.Dispatch<React.SetStateAction<LogEntry[]>>
) => {
    const handleRoleChange = async (userId: string, newRole: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`admin/users/${userId}/role`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
                alert('Cập nhật vai trò thành công');
            } else alert('Bạn không có quyền thực hiện hành động này');
        } catch { alert('Lỗi khi cập nhật'); }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`admin/users/${userId}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(prev => prev.filter(u => u._id !== userId));
            else alert('Bạn không có quyền thực hiện hành động này');
        } catch { alert('Lỗi khi xóa'); }
    };

    const handleDeleteBook = async (id: string) => {
        if(!confirm('Bạn có chắc chắn muốn xóa sách này?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`books/${id}`), { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setBooks(prev => prev.filter(b => b._id !== id));
                alert('Xóa sách thành công');
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.message || 'Bạn không có quyền thực hiện hành động này');
            }
        } catch { alert('Lỗi xóa sách'); }
    };

    const handleDeleteNews = async (id: string) => {
        if(!confirm('Xóa tin tức này?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`news/${id}`), { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setNews(prev => prev.filter(n => n._id !== id));
            else alert('Bạn không có quyền thực hiện hành động này');
        } catch { alert('Lỗi xóa tin'); }
    };

    const handleRemindUser = useCallback((userName: string) => {
        if (setAuditLogs) {
            const newLogEntry: LogEntry = {
                _id: `remind-${Date.now()}`,
                timestamp: new Date().toISOString(),
                user: 'Admin',
                action: 'Nhắc nhở',
                detail: `Gửi nhắc nhở trả sách quá hạn cho ${userName}`,
                role: 'admin'
            };
            setAuditLogs(prev => [newLogEntry, ...prev]);
        }
        alert(`Đã gửi thông báo nhắc nhở tới ${userName}`);
    }, [setAuditLogs]);

    const handleReturnBook = async (borrowId: string, setBorrows: React.Dispatch<React.SetStateAction<Borrow[]>>) => {
        if (!confirm('Xác nhận thu hồi/trả sách này?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`borrows/${borrowId}/return`), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBorrows(prev => prev.map(b => b._id === borrowId ? data.borrow : b));
                alert('Đã thu hồi sách thành công');
            } else alert('Bạn không có quyền thực hiện hành động này');
        } catch { alert('Lỗi khi thu hồi sách'); }
    };

    return {
        handleRoleChange, handleDeleteUser, handleDeleteBook,
        handleDeleteNews, handleRemindUser, handleReturnBook
    };
};

/**
 * Hook quản lý log hệ thống
 */
export const useAuditLogs = (isEnabled: boolean) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState<string>("");
    const [userSearch, setUserSearch] = useState("");

    const fetchLogs = useCallback(async () => {
        if (!isEnabled) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(), category, user: userSearch
            });
            const token = localStorage.getItem('token');
            const res = await fetch(getApiUrl(`admin/logs?${params}`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    }, [isEnabled, page, category, userSearch]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs, loading, page, setPage, totalPages,
        category, setCategory, userSearch, setUserSearch, refresh: fetchLogs,
        setLogs
    };
};
