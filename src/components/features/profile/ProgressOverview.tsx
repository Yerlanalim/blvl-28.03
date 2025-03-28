/**
 * @file ProgressOverview.tsx
 * @description Component for displaying overall progress information
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressOverviewProps {
  completedLevels: number;
  totalLevels: number;
  overallProgress: number;
}

/**
 * ProgressOverview component
 * 
 * Displays overall progress with progress bar
 */
export function ProgressOverview({ completedLevels, totalLevels, overallProgress }: ProgressOverviewProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Прогресс</h3>
        
        <Progress value={overallProgress} className="h-3 mb-4" />
        
        <p className="text-center">
          Вы прошли <span className="font-bold">{completedLevels}</span> уровней из{' '}
          <span className="font-bold">{totalLevels}</span> доступных
        </p>
      </CardContent>
    </Card>
  );
} 