/**
 * @file page.tsx
 * @description Map page with level map component
 * @dependencies components/features/level-map/LevelMap
 */

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LevelMap } from '@/components/features/level-map/LevelMap';

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <LevelMap />
      </div>
    </ProtectedRoute>
  );
} 