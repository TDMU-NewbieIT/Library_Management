"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const {
      formData, isLoading, message, handleChange, changePassword
  } = useSettings(user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await changePassword();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-library pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-4">Vui lòng đăng nhập</h2>
          <Link href="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pt-32 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="relative">
          {/* Background Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/40 dark:border-zinc-800/50">
            <div className="flex items-center gap-6 mb-12">
               <Link 
                 href="/profile" 
                 className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 hover:scale-105 active:scale-95 transition-all text-zinc-600 dark:text-zinc-400"
                 title="Quay lại"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
               </Link>
               <div>
                 <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Cài đặt</h1>
                 <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">Sửa đổi thông tin cá nhân</p>
               </div>
            </div>

            <div className="space-y-12">
              {/* Password Change Section */}
              <section className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-200">Đổi mật khẩu</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { id: 'currentPassword', label: 'Mật khẩu hiện tại', placeholder: '••••••••' },
                    { id: 'newPassword', label: 'Mật khẩu mới', placeholder: 'Tối thiểu 6 ký tự' },
                    { id: 'confirmPassword', label: 'Xác nhận mật khẩu mới', placeholder: '••••••••' }
                  ].map((field) => (
                    <div key={field.id} className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                      <label 
                        htmlFor={field.id}
                        className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1"
                      >
                        {field.label}
                      </label>
                      <input
                        type="password"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData] as string}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-5 py-4 bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all text-sm font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                        required
                      />
                    </div>
                  ))}

                  {message.text && (
                    <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-left-4 duration-300 ${
                      message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' 
                        : 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/10 dark:border-red-800/30'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-200 dark:shadow-none mt-4 group overflow-hidden relative"
                  >
                    <span className="relative z-10">{isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}</span>
                    {!isLoading && <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                  </button>
                </form>
              </section>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-100 dark:via-zinc-800 to-transparent" />

              {/* Theme Settings Section */}
              <section className="animate-fadeIn delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-black text-zinc-800 dark:text-zinc-200">Giao diện</h2>
                </div>
                
                <div className="relative group cursor-not-allowed">
                  <div className="p-6 bg-zinc-50/50 dark:bg-zinc-950/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[24px] text-center transition-all group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900">
                    <p className="text-[13px] font-bold text-zinc-400 dark:text-zinc-600 italic">Tính năng chuyển đổi giao diện nâng cao đang được cập nhật...</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500/20" />
                      <div className="w-3 h-3 rounded-full bg-pink-500/20" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
