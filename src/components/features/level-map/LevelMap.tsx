/**
 * @file LevelMap.tsx
 * @description Main level map component
 * @dependencies hooks/useLevels, components/features/level-map/*
 */

'use client';

import React from 'react';
import { useLevels } from '@/hooks/useLevels';
import { LevelCard } from './LevelCard';
import { LevelConnection } from './LevelConnection';
import { LevelStatus } from '@/types';

/**
 * LevelMap component
 * 
 * Displays the gamified level map with all levels and connections
 */
export function LevelMap() {
  const { getLevelsWithStatus, loading, error } = useLevels();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading levels: {error.message}
      </div>
    );
  }

  // Get levels with status
  const levels = getLevelsWithStatus();

  // Helper to get connection status
  const getConnectionStatus = (levelIndex: number): LevelStatus => {
    if (levelIndex <= 0) return LevelStatus.AVAILABLE;
    
    const previousLevel = levels[levelIndex - 1];
    if (previousLevel.status === LevelStatus.COMPLETED) {
      return LevelStatus.COMPLETED;
    }
    
    return LevelStatus.LOCKED;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Карта Уровней</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Row 1: Levels 1-3 */}
        <div className="col-span-1">
          <LevelCard level={levels[0]} status={levels[0].status} />
        </div>
        <div className="col-span-1 flex items-center">
          <LevelConnection direction="horizontal" status={getConnectionStatus(1)} />
        </div>
        <div className="col-span-1">
          <LevelCard level={levels[1]} status={levels[1].status} />
        </div>
        
        {/* Connector to Level 3 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 2: Level 3 */}
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[2]} status={levels[2].status} />
        </div>
        
        {/* Connector to Level 4 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-1/2 bg-gray-300"></div>
          <div className="absolute left-1/3 top-1/2 w-1/3 h-1 bg-gray-300"></div>
        </div>
        
        {/* Row 3: Level 4 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[3]} status={levels[3].status} />
        </div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 5 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 4: Level 5 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[4]} status={levels[4].status} />
        </div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 6 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/3 top-0 w-1 h-1/2 bg-gray-300"></div>
          <div className="absolute left-0 top-1/2 w-1/3 h-1 bg-gray-300"></div>
        </div>
        
        {/* Row 5: Level 6 */}
        <div className="col-span-1">
          <LevelCard level={levels[5]} status={levels[5].status} />
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 7 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/6 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 6: Level 7 */}
        <div className="col-span-1">
          <LevelCard level={levels[6]} status={levels[6].status} />
        </div>
        <div className="col-span-1 flex items-center">
          <LevelConnection direction="horizontal" status={getConnectionStatus(7)} />
        </div>
        <div className="col-span-1">
          <LevelCard level={levels[7]} status={levels[7].status} />
        </div>
        
        {/* Connector to Level 9 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 7: Level 9 */}
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[8]} status={levels[8].status} />
        </div>
        
        {/* Connector to Level 10 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/2 right-1/2 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 8: Level 10 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[9]} status={levels[9].status} />
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
} 