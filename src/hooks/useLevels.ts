/**
 * @file useLevels.ts
 * @description Hook for accessing level data and user progress
 * @dependencies lib/data/levels, hooks/useProgress
 */

import { useState, useEffect, useCallback } from 'react';
import { Level, LevelStatus } from '@/types';
import { getLevels, getLevelById } from '@/lib/data/levels';
import { useProgress } from './useProgress';

/**
 * Hook for accessing and managing level data
 */
export function useLevels() {
  const { 
    progress, 
    isLoading: progressLoading,
    isLevelCompleted 
  } = useProgress();
  
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch levels
  useEffect(() => {
    try {
      // Get all levels
      const allLevels = getLevels();
      setLevels(allLevels);
      
      // If progress is still loading, we'll wait
      if (!progressLoading) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching levels:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch levels'));
      setLoading(false);
    }
  }, [progressLoading]);

  // Update loading state when progress finishes loading
  useEffect(() => {
    if (!progressLoading && loading) {
      setLoading(false);
    }
  }, [progressLoading, loading]);

  /**
   * Get status for a specific level
   */
  const getLevelStatus = useCallback((levelId: string): LevelStatus => {
    if (!progress) return LevelStatus.LOCKED;
    
    // If level is completed, return completed status
    if (isLevelCompleted(levelId)) {
      return LevelStatus.COMPLETED;
    }
    
    // If level is current level, it's available
    if (progress.currentLevel === levelId) {
      return LevelStatus.AVAILABLE;
    }
    
    // Get the level
    const level = getLevelById(levelId);
    if (!level) return LevelStatus.LOCKED;
    
    // First level is always available
    if (level.order === 1) {
      return LevelStatus.AVAILABLE;
    }
    
    // Check if previous level is completed
    const previousLevelId = `level-${level.order - 1}`;
    if (isLevelCompleted(previousLevelId)) {
      return LevelStatus.AVAILABLE;
    }
    
    return LevelStatus.LOCKED;
  }, [progress, isLevelCompleted]);

  /**
   * Get all levels with their status
   */
  const getLevelsWithStatus = useCallback((): (Level & { status: LevelStatus })[] => {
    return levels.map(level => ({
      ...level,
      status: getLevelStatus(level.id)
    }));
  }, [levels, getLevelStatus]);

  return {
    levels,
    progress,
    loading: loading || progressLoading,
    error,
    getLevelStatus,
    isLevelCompleted,
    getLevelsWithStatus
  };
} 