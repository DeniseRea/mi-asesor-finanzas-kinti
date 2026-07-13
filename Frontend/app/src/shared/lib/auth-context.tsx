'use client';

import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/shared/lib/firebase';
import { apiClient, storeToken, getStoredToken, removeToken } from '@/shared/api/apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ProfileResponse, VerifyEmailRequest, VerifyEmailResponse, ResendVerificationRequest, ResendVerificationResponse, LogoutResponse } from '@/shared/api/types';
import type { User } from '@entities/user/model/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<VerifyEmailResponse>;
  resendVerification: (data: ResendVerificationRequest) => Promise<ResendVerificationResponse>;
  enterDemo: () => void;
  completeExternalLogin: (token: string) => Promise<void>;
  sessionNotice: 'expired' | 'unavailable' | null;
  clearSessionNotice: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionNotice, setSessionNotice] = useState<'expired' | 'unavailable' | null>(null);

  useEffect(() => {
    const demoMode = typeof window !== 'undefined' && localStorage.getItem('kinti_demo') === 'true';
    if (demoMode) {
      queueMicrotask(() => {
        setUser({ id: 'demo-user', name: 'María Demo', email: 'demo@kinti.app' });
        setIsLoading(false);
      });
      return;
    }
    const token = getStoredToken();
    if (!token) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }
    let active = true;
    apiClient<ProfileResponse>('/api/auth/profile')
      .then((res) => { if (active) setUser({ id: res.id, name: res.name, email: res.email }); })
      .catch((error: unknown) => {
        removeToken();
        const status = typeof error === 'object' && error && 'status' in error ? Number(error.status) : 0;
        setSessionNotice(status === 401 || status === 403 ? 'expired' : 'unavailable');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const expire = () => { removeToken(); localStorage.removeItem('kinti_demo'); setUser(null); setSessionNotice('expired'); };
    window.addEventListener('kinti:unauthorized', expire);
    return () => window.removeEventListener('kinti:unauthorized', expire);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await apiClient<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    storeToken(res.token);
    localStorage.removeItem('kinti_demo');
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
    localStorage.removeItem('kinti_demo');
    setUser({ id: res.user.id, name: res.user.name, email: res.user.email });
  };

  const register = async (data: RegisterRequest) => {
    return apiClient<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const verifyEmail = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return apiClient<VerifyEmailResponse>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const resendVerification = async (data: ResendVerificationRequest): Promise<ResendVerificationResponse> => {
    return apiClient<ResendVerificationResponse>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const logout = async () => {
    const logoutRequest = apiClient<LogoutResponse>('/api/auth/logout', { method: 'POST', keepalive: true });
    removeToken();
    localStorage.removeItem('kinti_demo');
    setUser(null);
    try {
      await logoutRequest;
    } catch {
      // Logout local aunque falle el server
    }
  };

  const completeExternalLogin = useCallback(async (token: string) => {
    storeToken(token);
    try {
      const profile = await apiClient<ProfileResponse>('/api/auth/profile');
      setUser({ id: profile.id, name: profile.name, email: profile.email });
    } catch (error) {
      removeToken();
      throw error;
    }
  }, []);

  const enterDemo = () => {
    localStorage.setItem('kinti_demo', 'true');
    setUser({ id: 'demo-user', name: 'María Demo', email: 'demo@kinti.app' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, loginWithGoogle, register, verifyEmail, resendVerification, enterDemo, completeExternalLogin, sessionNotice, clearSessionNotice: () => setSessionNotice(null), logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
