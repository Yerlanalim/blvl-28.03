/**
 * @file layout.tsx
 * @description Main application layout wrapper for routes
 * @dependencies components/layout/MainLayout
 */

import { MainLayout } from '@/components/layout/MainLayout';

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 