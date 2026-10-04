'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '@/src/services/auth.service';
import type { LoginDto, UserPublic } from '@/src/types';

interface AuthContextValue {
  user: UserPublic | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('autohub_token');
    setUser(null);
    setToken(null);
  }, []);

  // Restaurar sessão do localStorage na inicialização
  useEffect(() => {
    const stored = localStorage.getItem('autohub_token');
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setToken(stored);
    authService
      .getMe()
      .then((me) => setUser(me))
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, [logout]);

  const login = useCallback(async (dto: LoginDto) => {
    const response = await authService.login(dto);
    localStorage.setItem('autohub_token', response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
