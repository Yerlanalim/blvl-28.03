/**
 * @file LoadingState.tsx
 * @description Reusable loading state component
 */

import React from 'react';

interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState component
 * 
 * Displays a loading spinner with optional message
 */
export function LoadingState({ message = 'Загрузка...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
} 