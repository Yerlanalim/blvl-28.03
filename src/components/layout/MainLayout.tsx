/**
 * @file MainLayout.tsx
 * @description Main application layout with sidebar navigation
 * @dependencies hooks/useAuth, components/layout/Sidebar
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout component
 * 
 * Main layout for authenticated pages with sidebar navigation
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 