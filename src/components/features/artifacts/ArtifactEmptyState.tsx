/**
 * @file ArtifactEmptyState.tsx
 * @description Component for showing empty state when no artifacts are found
 */

import React from 'react';
import { FileX } from 'lucide-react';

interface ArtifactEmptyStateProps {
  message?: string;
}

/**
 * ArtifactEmptyState component
 * 
 * Shows a message when no artifacts are found
 */
export function ArtifactEmptyState({ 
  message = "No artifacts found matching your criteria" 
}: ArtifactEmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <FileX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No artifacts found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
} 