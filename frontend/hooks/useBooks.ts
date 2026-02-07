"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// --- Types ---

export interface Author {
    name: string;
    birthYear?: number;
    deathYear?: number;
    era?: string;
    portraitUrl?: string;
}

export interface Book {
    _id: string;
    bookId: string;
    title: string;
    alternativeTitle?: string;
    author: Author;
    yearOfCreation: string;
    genre: string;
    imageUrl?: string;
    literaryPeriod?: string;
    language?: string;
    contentSummary?: string;
    artisticValue?: string;
    ideologicalValue?: string;
    historicalContext?: string;
    curriculumLevel?: string;
    keywords?: string[];
    stock?: number;
    totalQuantity?: number;
    isAvailable?: boolean;
    pdfUrl?: string;
}

export interface Comment {
    id: number;
    user: string;
    text: string;
    rating: number;
    date: string;
}

export interface BorrowRecord {
    _id: string;
    bookId: string;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'borrowing' | 'returned' | 'overdue';
    fee: number;
    lateFee: number;
}

export interface NewsItem {
    _id: string;
    title: string;
    summary: string;
    content: string;
    createdAt: string;
    author: string;
}

// --- Hooks ---

/**
 * Hook to manage global book listing
 */
export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://127.0.0.1:5000/api/books");
            if (!response.ok) throw new Error("Failed to fetch books");
            const data = await response.json();
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    return { books, loading, error, refetch: fetchBooks };
};

/**
 * Hook to manage book detail data and user interactions
 */
export const useBookDetail = (bookId: string | undefined, userId: string | undefined) => {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [borrowStatus, setBorrowStatus] = useState<'idle' | 'confirming' | 'success'>('idle');
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const fetchComments = useCallback(async () => {
        if (!bookId) return;
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/books/${bookId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) { console.error("Error fetching comments:", error); }
    }, [bookId]);

    const fetchData = useCallback(async () => {
        if (!bookId) return;
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/books/${bookId}`);
            if (!response.ok) throw new Error("Không tìm thấy tác phẩm");
            setBook(await response.json());
        } catch (err: unknown) { 
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra"); 
        } finally { setLoading(false); }
    }, [bookId]);

    const checkFavorite = useCallback(async () => {
        if (!userId || !bookId) return;
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/users/${userId}`);
            const data = await res.json();
            if (data.favoriteBooks?.includes(bookId)) setIsFavorite(true);
        } catch (err) { console.error("Favorite check error:", err); }
    }, [userId, bookId]);

    useEffect(() => { fetchData(); checkFavorite(); fetchComments(); }, [fetchData, checkFavorite, fetchComments]);

    const toggleFavorite = async () => {
        if (!userId || !book) return { success: false, message: "Vui lòng đăng nhập" };
        setFavLoading(true);
        try {
            const method = isFavorite ? 'DELETE' : 'POST';
            const url = isFavorite 
                ? `http://127.0.0.1:5000/api/users/${userId}/favorites/${book.bookId}`
                : `http://127.0.0.1:5000/api/users/${userId}/favorites`;
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: isFavorite ? null : JSON.stringify({ bookId: book.bookId })
            });
            if (res.ok) { setIsFavorite(!isFavorite); return { success: true }; }
            return { success: false, message: "Thao tác thất bại" };
        } catch { return { success: false, message: "Lỗi kết nối" }; }
        finally { setFavLoading(false); }
    };

    const confirmBorrow = async (fee = 15000) => {
        if (!book || !userId) return { success: false, message: "Dữ liệu không hợp lệ" };
        try {
            const res = await fetch('http://127.0.0.1:5000/api/borrows', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId: book.bookId, userId, fee })
            });
            const data = await res.json();
            if (res.ok) { 
                setBorrowStatus('success'); 
                fetchData();
                return { success: true, message: data.message }; 
            }
            return { success: false, message: data.message || 'Có lỗi xảy ra' };
        } catch { return { success: false, message: 'Không thể kết nối với server' }; }
    };

    const addComment = async (text: string, rating: number) => {
        if (!text.trim() || !userId) return;
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/books/${bookId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, text, rating })
            });
            if (res.ok) fetchComments();
        } catch (err) { console.error("Failed to post comment", err); }
    };

    return {
        book, loading, error, borrowStatus, setBorrowStatus, isFavorite, favLoading,
        toggleFavorite, confirmBorrow, comments, addComment, refetch: fetchData
    };
};

/**
 * Hook to manage book borrowing history
 */
export const useBorrow = (userId: string | undefined, initialFilter = 'all') => {
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState(initialFilter);

    const fetchBorrows = useCallback(async () => {
        if (!userId) return;
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/borrows/user/${userId}?status=${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch borrow history");
            setBorrows(await res.json());
        } catch (err: unknown) { 
            setError(err instanceof Error ? err.message : "Failed to fetch borrow history"); 
        } finally { setLoading(false); }
    }, [userId, filter]);

    useEffect(() => { fetchBorrows(); }, [fetchBorrows]);

    const handleReturn = async (borrowId: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/borrows/${borrowId}/return`, {
                method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) { await fetchBorrows(); return { success: true, message: data.message, lateFee: data.lateFee }; }
            return { success: false, message: data.message || 'Return failed' };
        } catch (err: unknown) { 
            return { success: false, message: err instanceof Error ? err.message : "Unknown error" }; 
        }
    };

    return { borrows, loading, error, filter, setFilter, handleReturn, refetch: fetchBorrows };
};

/**
 * Hook to handle client-side filtering and pagination of books
 */
export const useFilteredBooks = (books: Book[], itemsPerPage = 6) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Tất cả");
    const [selectedPeriod, setSelectedPeriod] = useState("Tất cả");
    const [currentPage, setCurrentPage] = useState(1);

    const genres = useMemo(() => ["Tất cả", ...new Set(books.map(b => b.genre))], [books]);
    const periods = useMemo(() => ["Tất cả", ...new Set(books.map(b => b.literaryPeriod).filter(Boolean))], [books]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = (book.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (book.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === "Tất cả" || book.genre === selectedGenre;
            const matchesPeriod = selectedPeriod === "Tất cả" || book.literaryPeriod === selectedPeriod;
            return matchesSearch && matchesGenre && matchesPeriod;
        });
    }, [books, searchTerm, selectedGenre, selectedPeriod]);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const currentBooks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(start, start + itemsPerPage);
    }, [filteredBooks, currentPage, itemsPerPage]);

    return {
        searchTerm, setSearchTerm, selectedGenre, setSelectedGenre, selectedPeriod, setSelectedPeriod,
        currentPage, setCurrentPage, genres, periods, filteredBooks, currentBooks, totalPages,
        handlePageChange: (p: number) => setCurrentPage(p),
        resetFilters: () => { setSearchTerm(""); setSelectedGenre("Tất cả"); setSelectedPeriod("Tất cả"); setCurrentPage(1); }
    };
};

/**
 * Hook to manage user's localized book collection
 */
export const useMyBooks = () => {
    const [myBooks, setMyBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);

    // Sync with API for authenticated users, fallback to nothing (cleaner than LS conflict)
    const loadBooks = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                const userId = JSON.parse(user).id;
                // Fetch Favorites (My Books Shelf)
                const favRes = await fetch(`http://127.0.0.1:5000/api/users/${userId}/favorites`);

                let books: Book[] = [];
                
                 if (favRes.ok) {
                    const favs = await favRes.json();
                    books = [...favs];
                 }
                 
                setMyBooks(books);
            } catch (err) { console.error("Failed to sync my books", err); }
        } else {
            setMyBooks([]); // Clear on logout / no auth
        }
        setLoading(false);
    }, []);

    const addBook = () => { loadBooks(); }; // Just trigger reload
    const removeBook = async (bookId: string) => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) return;

        try {
            const userId = JSON.parse(user).id;

            await fetch(
                `http://127.0.0.1:5000/api/users/${userId}/favorites/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update UI ngay, không cần gọi lại API
            setMyBooks(prev => prev.filter(b => b._id !== bookId));
        } catch (err) {
            console.error("Failed to remove book", err);
        }
    };


    return { myBooks, loading, addBook, removeBook, refetch: loadBooks };
};

/**
 * Hook to manage news data fetching
 */
export const useNews = (limit?: number) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/news');
            if (!res.ok) throw new Error("Failed to fetch news");
            let data = await res.json();
            if (limit) data = data.slice(0, limit);
            setNews(data);
        } catch (err: unknown) { 
            setError(err instanceof Error ? err.message : "Failed to fetch news"); 
        } finally { setLoading(false); }
    }, [limit]);

    useEffect(() => { fetchNews(); }, [fetchNews]);

    return { news, loading, error, refetch: fetchNews };
};

/**
 * Hook to manage book searching, filtering and sorting from API
 */
export const useSearch = (query = "", initialGenre = "", initialSort = "title-asc") => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [genre, setGenre] = useState(initialGenre);
    const [sortBy, setSortBy] = useState(initialSort);

    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (genre) params.append("genre", genre);
            params.append("sortBy", sortBy);
            const res = await fetch(`http://127.0.0.1:5000/api/books/search?${params}`);
            if (!res.ok) throw new Error("Failed to fetch search results");
            setBooks(await res.json());
        } catch (err: unknown) { 
            setError(err instanceof Error ? err.message : "Failed to fetch search results"); 
        } finally { setLoading(false); }
    }, [query, genre, sortBy]);

    useEffect(() => { fetchResults(); }, [fetchResults]);

    return { books, loading, error, genre, setGenre, sortBy, setSortBy, refetch: fetchResults };
};
