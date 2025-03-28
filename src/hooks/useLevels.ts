/**
 * @file useLevels.ts
 * @description Hook for accessing level data and user progress
 * @dependencies lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { Level, LevelStatus, UserProgress } from '@/types';
import { getLevels, getLevelById, getLevelStatus } from '@/lib/data/levels';
import { getUserProgress, isLevelCompleted, isLevelAvailable } from '@/lib/data/user-progress';
import { useAuth } from './useAuth';

/**
 * Hook for accessing and managing level data
 */
export function useLevels() {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch levels and user progress
  useEffect(() => {
    try {
      // Get all levels
      const allLevels = getLevels();
      setLevels(allLevels);
      
      // Get user progress if user is authenticated
      if (user) {
        const progress = getUserProgress(user.id);
        setUserProgress(progress);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch levels'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Get status for a specific level
   */
  const getLevelStatusForUser = useCallback((levelId: string): LevelStatus => {
    if (!userProgress) return LevelStatus.LOCKED;
    
    // If level is completed, return completed status
    if (isLevelCompleted(levelId, userProgress)) {
      return LevelStatus.COMPLETED;
    }
    
    // If level is current level, it's available
    if (userProgress.currentLevel === levelId) {
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
    if (isLevelCompleted(previousLevelId, userProgress)) {
      return LevelStatus.AVAILABLE;
    }
    
    return LevelStatus.LOCKED;
  }, [userProgress]);

  /**
   * Check if a level is completed
   */
  const isCompleted = useCallback((levelId: string): boolean => {
    if (!userProgress) return false;
    return isLevelCompleted(levelId, userProgress);
  }, [userProgress]);

  /**
   * Check if a level is available
   */
  const isAvailable = useCallback((levelId: string): boolean => {
    if (!userProgress) return levelId === 'level-1'; // First level is always available
    return isLevelAvailable(levelId, userProgress);
  }, [userProgress]);

  /**
   * Get all levels with their status
   */
  const getLevelsWithStatus = useCallback((): (Level & { status: LevelStatus })[] => {
    return levels.map(level => ({
      ...level,
      status: getLevelStatusForUser(level.id)
    }));
  }, [levels, getLevelStatusForUser]);

  return {
    levels,
    userProgress,
    loading,
    error,
    getLevelStatusForUser,
    isCompleted,
    isAvailable,
    getLevelsWithStatus
  };
} 