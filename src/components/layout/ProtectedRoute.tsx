/**
 * @file ProtectedRoute.tsx
 * @description Protected route component that redirects unauthenticated users
 * @dependencies hooks/useAuth
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Wraps protected pages to ensure user is authenticated
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or checking auth
  if (isLoading || !isAuthenticated) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  // If authenticated, render children
  return <>{children}</>;
} 