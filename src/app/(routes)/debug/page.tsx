/**
 * @file page.tsx
 * @description Debug page for testing progress tracking
 * @dependencies components/features/admin/ProgressDebugPanel
 */

import { ProgressDebugPanel } from '@/components/features/admin/ProgressDebugPanel';

export default function DebugPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Debug Tools</h1>
      <p className="text-gray-600">
        This page contains tools for testing system functionality.
      </p>
      
      <ProgressDebugPanel />
    </div>
  );
} 