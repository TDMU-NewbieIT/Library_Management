"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '@/hooks/useBooks';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  /* Add useEffect to validate/refresh session */
  useEffect(() => {
    async function refreshUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(getApiUrl('auth/me'), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const freshUserData = await res.json();
             // Merge with token? No, token is separate.
             // Just update user. But assuming getMe returns full user object including role
            setUser({
                id: freshUserData._id,
                name: freshUserData.name,
                email: freshUserData.email,
                avatar: freshUserData.avatar,
                role: freshUserData.role
            });
            // Also update localStorage to keep it fresh
            localStorage.setItem('user', JSON.stringify({
                id: freshUserData._id,
                name: freshUserData.name,
                email: freshUserData.email,
                avatar: freshUserData.avatar,
                role: freshUserData.role
            }));
          } else {
             // Token invalid
             logout();
          }
        } catch {
          // Network error or server down, keep existing user or do nothing
        }
      }
      setLoading(false);
    }

    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
