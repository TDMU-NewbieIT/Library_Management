"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/hooks/useBooks";
import { useAdminAuth, useAdminData, useAdminActions, useAuditLogs, User } from "@/hooks/useAdmin";
import AdminLogin from "./AdminLogin";

export default function SystemAdmin() {
  const { mounted, isAdminLoggedIn, currentUserRole, handleLogin, handleLogout } = useAdminAuth();
  
  // Use admin data but we largely filter for staff here
  const { users, setUsers } = useAdminData(isAdminLoggedIn);
  
  const { 
    logs: auditLogs, setLogs,
    userSearch, setUserSearch: setLogUserSearch, // Rename to avoid conflict
    category, setCategory
  } = useAuditLogs(true); // Always fetch logs for System Admin

  const { handleRoleChange, handleDeleteUser } = useAdminActions(setUsers, () => {}, () => {}, setLogs);

  const [activeTab, setActiveTab] = useState<'staff' | 'audit'>('staff');
  const [userSearchText, setUserSearchText] = useState("");

  const handleResetDatabase = async () => {
    if (!confirm('Bạn có chắc chắn muốn reset toàn bộ kho sách và bản tin về trạng thái mẫu? Hành động này sẽ xóa dữ liệu hiện tại và không thể hoàn tác.')) return;
    
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(getApiUrl('system/reset'), {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            window.location.reload();
        } else {
            alert(data.message || 'Lỗi khi reset hệ thống');
        }
    } catch (error) {
        console.error('Reset database failed:', error);
        alert('Lỗi kết nối máy chủ');
    }
  };

  if (!mounted) return null;

  if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleLogin} />;
  }

  // STRICT GUARD: If logged in but NOT admin, deny access
  if (currentUserRole !== 'admin') {
      return (
          <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
              <div className="bg-zinc-800 p-8 rounded-2xl max-w-md w-full text-center border border-red-900/50">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Truy cập bị từ chối</h2>
                  <p className="text-zinc-400 mb-8">Khu vực này chỉ dành cho Quản trị viên cấp cao (System Admin). Tài khoản Thủ thư không có quyền truy cập.</p>
                  <button 
                    onClick={() => window.location.href = '/admin'}
                    className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl font-bold transition-colors mb-3"
                  >
                      Quay về trang quản lý
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl font-bold transition-colors"
                  >
                      Đăng xuất & Đổi tài khoản
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
        {/* Header / Navbar */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                </div>
                <div>
                    <h1 className="text-xl font-black text-white tracking-tight">SYSTEM ADMIN</h1>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Hệ thống quản trị cấp cao</p>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                 <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-900/20 rounded-full border border-green-900/50">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Hệ thống an toàn</span>
                 </div>
                     <div className="flex items-center gap-3">
                    <Link 
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition-all text-xs"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Trang chủ
                    </Link>
                    <button 
                        onClick={handleResetDatabase}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl font-bold transition-all text-xs border border-red-900/30"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Reset Dữ liệu
                    </button>
                    <div className="text-right hidden md:block border-l border-zinc-800 pl-6">
                        <div className="text-sm font-bold text-white">Administrator</div>
                        <div className="text-[10px] text-zinc-500">Super User</div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-9 h-9 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors"
                        title="Đăng xuất hệ thống"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto p-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 space-y-1">
                    <button 
                        onClick={() => setActiveTab('staff')}
                        className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'staff' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        Quản lý Nhân sự
                    </button>
                    <button 
                        onClick={() => setActiveTab('audit')}
                        className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'audit' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Nhật ký Hệ thống
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                     {activeTab === 'staff' && (
                        <div className="space-y-6 animate-fadeIn">
                             <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Nhân sự & Phân quyền</h2>
                                    <p className="text-zinc-500 mt-1">Quản lý các tài khoản Thủ thư (Librarian) và Quản trị viên</p>
                                </div>
                                <div className="relative">
                                     <input 
                                        type="text" 
                                        placeholder="Tìm nhân sự..." 
                                        value={userSearchText}
                                        onChange={(e) => setUserSearchText(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-red-900 outline-none w-64 text-white placeholder-zinc-600"
                                    />
                                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                </div>
                             </div>

                             {['admin', 'librarian'].map((role) => {
                                 const filtered = users.filter((u: User) => (u.role === role) && (u.name.toLowerCase().includes(userSearchText.toLowerCase()) || u.email.toLowerCase().includes(userSearchText.toLowerCase())));
                                 if (filtered.length === 0 && role === 'admin') return null; // Always show librarians block if empty? No, skip if empty/search mismatch

                                 const title = role === 'admin' ? 'Ban Quản trị (Admin)' : 'Đội ngũ Thủ thư (Librarian)';
                                 const bg = role === 'admin' ? 'bg-purple-900/10 border-purple-900/30' : 'bg-blue-900/10 border-blue-900/30';
                                 
                                 if (filtered.length === 0) return (
                                     <div key={role} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                                         <p className="text-zinc-500 italic">Không tìm thấy {role === 'admin' ? 'Quản trị viên' : 'Thủ thư'} nào.</p>
                                     </div>
                                 );

                                 return (
                                     <div key={role} className={`p-6 rounded-3xl border ${bg}`}>
                                         <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                                             {role === 'admin' ? '👑' : '📖'} {title}
                                         </h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filtered.map((u: User) => (
                                                <div key={u._id} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors group">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-xl font-bold text-zinc-200">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                                                            title="Xóa tài khoản"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                        </button>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h4 className="font-bold text-white mb-1 truncate flex items-center gap-2">
                                                            {u.name}
                                                            {u.isOnline ? (
                                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Đang online"></span>
                                                            ) : (
                                                                <span className="w-2 h-2 rounded-full bg-zinc-700" title={`Offline ${u.lastActiveMinutes ? `- Online ${u.lastActiveMinutes}p trước` : ''}`}></span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                                                        {!u.isOnline && u.lastActiveMinutes && (
                                                            <p className="text-[10px] text-zinc-600 mt-1">Online {u.lastActiveMinutes} phút trước</p>
                                                        )}
                                                    </div>
                                                    <div className="pt-4 border-t border-zinc-800">
                                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Vai trò</p>
                                                        <select
                                                            aria-label="Chọn vai trò người dùng"
                                                            value={u.role}
                                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-zinc-600"
                                                        >
                                                            <option value="admin">Quản trị viên</option>
                                                            <option value="librarian">Thủ thư</option>
                                                            <option value="user">Độc giả (Hạ cấp)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                         </div>
                                     </div>
                                 );
                             })}
                        </div>
                     )}

                     {activeTab === 'audit' && (
                         <div className="space-y-6 animate-fadeIn">
                             <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white">Nhật ký Hệ thống (Audit Logs)</h2>
                                <button onClick={() => alert('Feature coming soon: Export Logs')} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                                    Xuất báo cáo
                                </button>
                             </div>

                             {/* Filters */}
                             <div className="flex flex-col md:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Tìm theo người dùng</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập tên người dùng..." 
                                        value={userSearch}
                                        onChange={(e) => setLogUserSearch(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Hành động</label>
                                    <select
                                        aria-label="Filter by category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="AUTH">Đăng nhập/xuat</option>
                                        <option value="BOOK">Quản lý sách</option>
                                        <option value="USER">Quản lý User</option>
                                        <option value="ADMIN">Hệ thống</option>
                                    </select>
                                </div>
                             </div>
                             
                             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm text-left text-zinc-400">
                                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-950">
                                        <tr>
                                            <th className="px-6 py-4">Thời gian</th>
                                            <th className="px-6 py-4">Người thực hiện</th>
                                            <th className="px-6 py-4">Hành động</th>
                                            <th className="px-6 py-4">Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {auditLogs.length > 0 ? auditLogs.map((log) => (
                                            <tr key={log._id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-zinc-300">{log.user}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                        log.action.includes('Xóa') ? 'bg-red-900/30 text-red-500' : 
                                                        log.action.includes('Sửa') ? 'bg-blue-900/30 text-blue-500' : 
                                                        'bg-zinc-800 text-zinc-400'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500">{log.detail}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-600 italic">
                                                    Chưa có dữ liệu nhật ký
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                             </div>
                         </div>
                     )}
                </div>
            </div>
        </main>
    </div>
  );
}
