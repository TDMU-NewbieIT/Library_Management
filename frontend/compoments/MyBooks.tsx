"use client";

import Link from "next/link";
import Image from "next/image";
import { useMyBooks } from "@/hooks/useBooks";

export default function MyBooks() {
  const { myBooks, loading, removeBook } = useMyBooks();

  return (
    <div className="max-w-7xl mx-auto pt-44 pb-20 px-6 animate-fadeIn bg-library min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-zinc-100 dark:border-zinc-800 pb-10">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tight italic">
            KHO SÁCH <span className="text-indigo-600 not-italic">CỦA BẠN</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-lg">
            Nơi lưu trữ các tác phẩm văn học bạn đã mượn và sở hữu. Hãy tiếp tục hành trình khám phá kho tàng tri thức dân tộc.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all">
            Khám phá thêm
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
        </div>
      ) : myBooks.length === 0 ? (
        <div className="py-32 text-center bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center text-zinc-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Kho sách của bạn đang trống</h3>
            <p className="text-zinc-400 text-sm">Bạn chưa mượn bất kỳ tác phẩm nào.</p>
          </div>
          <Link href="/" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
            Mượn sách ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {myBooks.map((book) => (
            <div key={book._id} className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                {book.imageUrl ? (
                  <Image src={book.imageUrl} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                ) : (
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-serif italic text-xs">NO IMAGE</div>
                )}
              </div>
              
              <div className="flex-grow space-y-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase rounded-md border border-green-100 dark:border-green-800">CỦA BẠN</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{book.genre}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-zinc-500 text-xs font-semibold">{book.author.name}</p>
              </div>

              <div className="mt-8 px-2 space-y-3 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href={`/books/${book.bookId}`} 
                    className="py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center block hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    Đọc sách
                  </Link>
                  <button 
                    onClick={() => removeBook(book._id)}
                    className="py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
                  >
                    Xóa sách
                  </button>
                </div>
                <Link 
                  href={`/books/${book.bookId}`} 
                  className="w-full py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-xl font-bold text-[9px] uppercase tracking-widest text-center block hover:border-zinc-400 transition-all"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
