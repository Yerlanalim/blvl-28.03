/**
 * @file BadgeDisplay.tsx
 * @description Component for displaying user badges
 */

import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { AwardIcon } from 'lucide-react';

interface BadgeDisplayProps {
  badge: Badge;
}

/**
 * BadgeDisplay component
 * 
 * Displays a user badge with icon and name
 */
export function BadgeDisplay({ badge }: BadgeDisplayProps) {
  return (
    <Card className={`w-full ${badge.achieved ? 'bg-white' : 'bg-gray-100'}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <div className={`mb-2 p-2 rounded-full ${badge.achieved ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'}`}>
          <AwardIcon className="w-8 h-8" />
        </div>
        <h4 className="text-sm font-medium text-center">{badge.name}</h4>
        {!badge.achieved && <p className="text-xs text-gray-500 mt-1">Locked</p>}
      </CardContent>
    </Card>
  );
} 