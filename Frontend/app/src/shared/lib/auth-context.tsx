'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/shared/lib/firebase';
import { apiClient, storeToken, getStoredToken, removeToken } from '@/shared/api/apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest, ProfileResponse } from '@/shared/api/types';
import type { User } from '@entities/user/model/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }
    let active = true;
    apiClient<ProfileResponse>('/api/auth/profile')
      .then((res) => { if (active) setUser({ id: res.id, name: res.name, email: res.email }); })
      .catch(() => removeToken())
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    storeToken(res.token);
    setUser({ id: res.user.id, name: res.user.name, email: res.user.email });
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await apiClient<LoginResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    storeToken(res.token);
    setUser({ id: res.user.id, name: res.user.name, email: res.user.email });
  };

  const register = async (data: RegisterRequest) => {
    await apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
