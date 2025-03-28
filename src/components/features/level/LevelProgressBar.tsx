/**
 * @file LevelProgressBar.tsx
 * @description Component for showing progress within a level
 */

import React from 'react';

interface LevelProgressSegment {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface LevelProgressBarProps {
  segments: LevelProgressSegment[];
}

/**
 * LevelProgressBar component
 * 
 * Shows level progress as connected segments
 */
export function LevelProgressBar({ segments }: LevelProgressBarProps) {
  return (
    <div className="w-full flex items-center space-x-1">
      {segments.map((segment, index) => (
        <React.Fragment key={segment.id}>
          {/* Progress segment */}
          <div 
            className={`h-2 flex-1 rounded-full ${
              segment.isCompleted ? 'bg-teal-500' : 'bg-gray-300'
            }`}
            title={segment.title}
          />
          
          {/* Connector between segments (except after the last one) */}
          {index < segments.length - 1 && (
            <div className="w-1 h-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
} 