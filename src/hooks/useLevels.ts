/**
 * @file useLevels.ts
 * @description Hook for accessing level data and user progress with React Query
 * @dependencies lib/services/level-service, hooks/useProgress, @tanstack/react-query
 */

import { useCallback } from 'react';
import { Level, LevelStatus } from '@/types';
import { getLevels, getLevelById, getLevelStatus } from '@/lib/services/level-service';
import { useProgress } from './useProgress';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook for accessing and managing level data with React Query
 */
export function useLevels() {
  const { 
    progress, 
    isLoading: progressLoading,
    isLevelCompleted 
  } = useProgress();
  
  // Query for fetching all levels
  const { 
    data: levels = [], 
    isLoading: levelsLoading, 
    error 
  } = useQuery({
    queryKey: ['levels'],
    queryFn: getLevels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Get status for a specific level
   */
  const getStatus = useCallback((levelId: string): LevelStatus => {
    if (!progress) return LevelStatus.LOCKED;
    
    return getLevelStatus(
      levelId, 
      progress.completedLevels, 
      progress.currentLevel
    );
  }, [progress]);

  /**
   * Get all levels with their status
   */
  const getLevelsWithStatus = useCallback((): (Level & { status: LevelStatus })[] => {
    return levels.map(level => ({
      ...level,
      status: getStatus(level.id)
    }));
  }, [levels, getStatus]);
  
  /**
   * Get level by ID with its status
   */
  const getLevelWithStatus = useCallback((levelId: string) => {
    const level = levels.find(level => level.id === levelId);
    if (!level) return null;
    
    return {
      ...level,
      status: getStatus(levelId)
    };
  }, [levels, getStatus]);

  // Combine loading states
  const isLoading = levelsLoading || progressLoading;

  return {
    levels,
    progress,
    isLoading,
    error,
    getLevelStatus: getStatus,
    isLevelCompleted,
    getLevelsWithStatus,
    getLevelWithStatus
  };
} 