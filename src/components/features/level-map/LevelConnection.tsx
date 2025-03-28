/**
 * @file LevelConnection.tsx
 * @description Component for displaying connections between levels
 */

import React from 'react';
import { LevelStatus } from '@/types';

interface LevelConnectionProps {
  direction: 'horizontal' | 'vertical' | 'corner-right' | 'corner-left';
  status: LevelStatus;
}

/**
 * LevelConnection component
 * 
 * Displays a connection line between level cards
 */
export function LevelConnection({ direction, status }: LevelConnectionProps) {
  // Determine line styling based on status
  const lineColor = status === LevelStatus.COMPLETED 
    ? 'bg-teal-500' 
    : 'bg-gray-300';
  
  // Horizontal line
  if (direction === 'horizontal') {
    return (
      <div className="flex items-center justify-center w-full h-4">
        <div className={`h-1 w-full ${lineColor}`}></div>
      </div>
    );
  }

  // Vertical line
  if (direction === 'vertical') {
    return (
      <div className="flex items-center justify-center w-4 h-full">
        <div className={`w-1 h-full ${lineColor}`}></div>
      </div>
    );
  }

  // Corner right (┌)
  if (direction === 'corner-right') {
    return (
      <div className="relative w-full h-full">
        <div className={`absolute right-1/2 top-0 w-1 h-1/2 ${lineColor}`}></div>
        <div className={`absolute right-1/2 top-1/2 w-1/2 h-1 ${lineColor}`}></div>
      </div>
    );
  }

  // Corner left (┐)
  if (direction === 'corner-left') {
    return (
      <div className="relative w-full h-full">
        <div className={`absolute left-1/2 top-0 w-1 h-1/2 ${lineColor}`}></div>
        <div className={`absolute left-0 top-1/2 w-1/2 h-1 ${lineColor}`}></div>
      </div>
    );
  }

  return null;
} 