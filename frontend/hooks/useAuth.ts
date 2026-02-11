"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getApiUrl } from "./useBooks";

// --- Types ---

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatar?: string;
    role: string;
    readingGoal: number;
    booksRead: number;
    createdAt: string;
}

export interface UserStats {
    booksRead: number;
    readingGoal: number;
    favoriteCount: number;
    totalBorrows: number;
    currentBorrows: number;
    overdueBorrows: number;
    memberSince: string;
}

// --- Hooks ---

/**
 * Hook to manage login/register logic
 */
export const useAuthActions = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [idCard, setIdCard] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login: contextLogin } = useAuth();
    const router = useRouter();

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(getApiUrl('auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                contextLogin(data.token, data.user);
                router.push('/');
                return { success: true };
            } else {
                setError(data.message || 'Đăng nhập thất bại');
                return { success: false };
            }
        } catch (err: unknown) {
            console.error("Login Error:", err);
            setError('Không thể kết nối với máy chủ');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        if (password !== confirmPassword && confirmPassword !== '') {
            setError('Mật khẩu không khớp');
            return { success: false };
        }

        setLoading(true);
        try {
            const res = await fetch(getApiUrl('auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone, address, idCard }),
            });

            const data = await res.json();
            if (res.ok) {
                contextLogin(data.token, data.user);
                router.push('/');
                return { success: true };
            } else {
                setError(data.message || 'Đăng ký thất bại');
                return { success: false };
            }
        } catch (err: unknown) {
            console.error("Register Error:", err);
            setError('Không thể kết nối với máy chủ');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail, name, setName, password, setPassword,
        confirmPassword, setConfirmPassword, phone, setPhone,
        address, setAddress, idCard, setIdCard, showPassword, setShowPassword,
        error, setError, loading, handleLogin, handleRegister
    };
};

/**
 * Hook to manage user profile and statistics
 */
export const useProfile = (userId: string | undefined) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '', phone: '', address: '', bio: '', readingGoal: 12
    });

    const fetchData = useCallback(async () => {
        if (!userId) return;
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);
        try {
            const [profileRes, statsRes] = await Promise.all([
                fetch(getApiUrl(`users/${userId}`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(getApiUrl(`users/${userId}/stats`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            if (!profileRes.ok || !statsRes.ok) throw new Error("Failed to load profile data");
            const profileData = await profileRes.json();
            const statsData = await statsRes.json();
            setProfile(profileData);
            setStats(statsData);
            setEditForm({
                name: profileData.name || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                bio: profileData.bio || '',
                readingGoal: profileData.readingGoal || 12
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not load profile");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = async () => {
        if (!userId) return { success: false, message: 'No user ID' };
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`users/${userId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data.user);
                setIsEditing(false);
                return { success: true };
            } else return { success: false, message: data.message || 'Update failed' };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        }
    };

    const { user, updateUser } = useAuth();

    const updateAvatar = async (avatar: string) => {
        if (!userId) return { success: false, message: 'No user ID' };
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`users/${userId}/avatar`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ avatar })
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(prev => prev ? { ...prev, avatar: data.avatar } : null);
                // Correctly merge the avatar update into the existing user state
                if (user) {
                    updateUser({ ...user, avatar: data.avatar });
                }
                return { success: true, avatar: data.avatar };
            } else return { success: false, message: data.message || 'Avatar update failed' };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        }
    };

    return {
        profile, stats, loading, error, isEditing, setIsEditing,
        editForm, setEditForm, handleUpdate, updateAvatar, refetch: fetchData
    };
};

/**
 * Hook to manage user account settings
 */
export const useSettings = (userId: string | undefined) => {
    const [formData, setFormData] = useState({
        currentPassword: "", newPassword: "", confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const changePassword = async () => {
        setMessage({ type: "", text: "" });
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu mới không khớp!" });
            return { success: false };
        }
        if (formData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            return { success: false };
        }
        if (!userId) return { success: false };

        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(getApiUrl(`users/${userId}/password`), {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                return { success: true };
            } else {
                setMessage({ type: "error", text: data.message || "Đổi mật khẩu thất bại" });
                return { success: false };
            }
        } catch {
            setMessage({ type: "error", text: "Lỗi kết nối server" });
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, setFormData, isLoading, message, setMessage, handleChange, changePassword };
};

/**
 * Hook to track user activity and send heartbeat
 */
export const useActivityTracker = (userId: string | undefined) => {
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isIdleRef = useRef(false);

    const sendHeartbeat = useCallback(async () => {
        if (!userId || isIdleRef.current) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(getApiUrl(`users/${userId}/heartbeat`), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Heartbeat error:", error);
        }
    }, [userId]);

    const startHeartbeat = useCallback(() => {
        if (heartbeatTimerRef.current) return;
        sendHeartbeat();
        heartbeatTimerRef.current = setInterval(sendHeartbeat, 60000);
    }, [sendHeartbeat]);

    const stopHeartbeat = useCallback(() => {
        if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
            heartbeatTimerRef.current = null;
        }
    }, []);

    const onActivity = useCallback(() => {
        if (isIdleRef.current) {
            isIdleRef.current = false;
            startHeartbeat();
        }
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            isIdleRef.current = true;
            stopHeartbeat();
        }, 5 * 60 * 1000);
    }, [startHeartbeat, stopHeartbeat]);

    useEffect(() => {
        if (!userId) return;
        startHeartbeat();
        onActivity();
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, onActivity));
        return () => {
            events.forEach(event => window.removeEventListener(event, onActivity));
            stopHeartbeat();
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [userId, onActivity, startHeartbeat, stopHeartbeat]);
};
