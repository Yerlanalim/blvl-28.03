/**
 * @file providers.tsx
 * @description Global providers wrapper
 * @dependencies context/AuthContext
 */

'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component
 * 
 * Wraps the application with all necessary providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
} 