'use client';

import React from 'react';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ToastProvider } from '@/src/contexts/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
