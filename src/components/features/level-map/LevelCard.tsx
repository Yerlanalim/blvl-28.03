/**
 * @file LevelCard.tsx
 * @description Card component for displaying a level in the map
 */

import React from 'react';
import Link from 'next/link';
import { LockIcon, CheckIcon } from 'lucide-react';
import { Level, LevelStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface LevelCardProps {
  level: Level;
  status: LevelStatus;
}

/**
 * LevelCard component
 * 
 * Displays a level card with appropriate styling based on status
 */
export function LevelCard({ level, status }: LevelCardProps) {
  // Determine card styling based on status
  const cardStyles = {
    [LevelStatus.COMPLETED]: 'bg-teal-500 text-white hover:bg-teal-600',
    [LevelStatus.AVAILABLE]: 'bg-white hover:bg-gray-50',
    [LevelStatus.LOCKED]: 'bg-gray-100 text-gray-500 cursor-not-allowed'
  };

  // Status icon
  const StatusIcon = () => {
    if (status === LevelStatus.COMPLETED) {
      return <CheckIcon className="w-5 h-5" />;
    }
    
    if (status === LevelStatus.LOCKED) {
      return <LockIcon className="w-5 h-5" />;
    }
    
    return null;
  };

  // Render card with appropriate link
  const cardContent = (
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Level {level.order}</h3>
          <p className={`text-sm ${status === LevelStatus.LOCKED ? 'text-gray-400' : ''}`}>
            {level.title}
          </p>
        </div>
        <StatusIcon />
      </div>
    </CardContent>
  );

  // Wrap with Link if not locked
  if (status === LevelStatus.LOCKED) {
    return (
      <Card className={`w-full ${cardStyles[status]}`}>
        {cardContent}
      </Card>
    );
  }

  return (
    <Link href={`/level/${level.id}`}>
      <Card className={`w-full ${cardStyles[status]}`}>
        {cardContent}
      </Card>
    </Link>
  );
} 