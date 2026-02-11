"use client";

import { useAuthActions } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Register() {
  const { 
    name, setName,
    email, setEmail, 
    password, setPassword, 
    phone, setPhone,
    address, setAddress,
    idCard, setIdCard,
    showPassword, setShowPassword,
    error, loading, handleRegister 
  } = useAuthActions();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 pt-32 pb-12">
      <div className="max-w-[460px] w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl">
        <div className="mb-10 text-center">
             <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Đăng ký</h1>
             <p className="text-zinc-400 text-xs font-medium mt-2">Điền đầy đủ thông tin để tham gia thư viện</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 text-red-500 text-[11px] font-bold p-3 rounded-xl border border-red-100 dark:border-red-900/20 mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Họ và tên</label>
                 <input 
                   type="text" 
                   required
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                   placeholder="Nguyễn Văn A"
                 />
               </div>

               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Số điện thoại</label>
                 <input 
                   type="tel" 
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                   placeholder="09xx xxx xxx"
                 />
               </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Địa chỉ</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="Quận/Huyện, Tỉnh/Thành phố"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Số CCCD</label>
                 <input 
                   type="text" 
                   value={idCard}
                   onChange={(e) => setIdCard(e.target.value)}
                   className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                   placeholder="12 chữ số"
                 />
               </div>

               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Mật khẩu</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm pr-12"
                      placeholder="Tối thiểu 6 ký tự"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-zinc-400 hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                      )}
                    </button>
                 </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-50 mt-4"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-zinc-400 text-xs font-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}
