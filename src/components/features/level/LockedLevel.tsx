/**
 * @file LockedLevel.tsx
 * @description Component for displaying a locked level screen
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Level } from '@/types';

interface LockedLevelProps {
  level: Level;
  onBackClick: () => void;
}

/**
 * LockedLevel component
 * 
 * Displays a screen for a locked level
 */
export function LockedLevel({ level, onBackClick }: LockedLevelProps) {
  return (
    <div className="container max-w-md py-12">
      <div className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-orange-500" />
        </div>
        
        <h1 className="text-2xl font-bold">Уровень заблокирован</h1>
        
        <p className="text-muted-foreground">
          Для доступа к уровню <strong>{level.title}</strong> необходимо сначала завершить предыдущие уровни.
        </p>
        
        {level.isPremium && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            Этот уровень доступен только для пользователей с премиум-подпиской.
          </div>
        )}
        
        <Button onClick={onBackClick} className="mt-4">
          Вернуться назад
        </Button>
      </div>
    </div>
  );
} 