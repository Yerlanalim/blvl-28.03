/**
 * @file AuthLayout.tsx
 * @description Authentication layout component
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout component
 * 
 * Layout for authentication pages
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="text-3xl font-bold text-teal-500">BizLevel</div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
} 