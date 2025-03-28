/**
 * @file auth/layout.tsx
 * @description Authentication pages layout
 * @dependencies components/layout/AuthLayout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';

export const metadata: Metadata = {
  title: 'Authentication - BizLevel',
  description: 'Sign in or register for BizLevel',
};

export default function AuthPagesLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
} 