/**
 * @file SkillProgressBar.tsx
 * @description Component for displaying skill progress as a bar with dots
 */

import React from 'react';

interface SkillProgressBarProps {
  name: string;
  progress: number;
  maxDots?: number;
}

/**
 * SkillProgressBar component
 * 
 * Displays skill progress as a series of dots
 */
export function SkillProgressBar({ name, progress, maxDots = 10 }: SkillProgressBarProps) {
  // Calculate how many dots should be filled
  const filledDots = Math.round((progress / 100) * maxDots);
  
  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-1">
        <div className="bg-teal-500 text-white text-sm px-4 py-2 rounded-full w-full">
          {name}
        </div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: maxDots }).map((_, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full ${
              index < filledDots ? 'bg-teal-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 