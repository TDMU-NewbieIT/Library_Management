"use client";
import { useState } from 'react';
import { getApiUrl } from '@/hooks/useBooks';

interface AdminLoginProps {
  onLogin: (role: 'admin' | 'librarian') => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Support either 'admin' shorthand or full email
    const loginEmail = username === 'admin' ? 'admin@library.com' : username;
    
    try {
      const res = await fetch(getApiUrl('auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.user.role === 'admin' || data.user.role === 'librarian') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin(data.user.role);
        } else {
          setError('Tài khoản không có quyền truy cập');
        }
      } else {
        setError(data.message || 'Thông tin đăng nhập không hợp lệ');
      }
    } catch {
      setError('Lỗi kết nối với máy chủ API');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-[400px] border border-zinc-800 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 group-hover:scale-105 transition-transform">
          <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>

        <h2 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-tighter italic">Cổng Quản Trị</h2>
        <p className="text-zinc-500 text-xs text-center mb-8 font-medium">Vui lòng xác thực quyền truy cập thư viện</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="123"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
