/**
 * @file useProgress.ts
 * @description Hook for accessing and updating user progress
 * @dependencies lib/services/progress-service
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UserProgress, SkillType, Badge } from '@/types';
import { 
  getUserProgress, 
  markVideoWatched, 
  markTestCompleted, 
  markArtifactDownloaded, 
  completeLevel, 
  resetUserProgress 
} from '@/lib/services/progress-service';
import { 
  getSkillsInfo, 
  getSkillInfo, 
  formatSkillsProgress, 
  getDominantSkills,
  getSkillRecommendations,
  SkillInfo
} from '@/lib/services/skill-service';

/**
 * Hook for accessing and updating user progress
 */
export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user progress
  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setProgress(null);
        setIsLoading(false);
        return;
      }

      try {
        const userProgress = await getUserProgress(user.id);
        setProgress(userProgress);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading progress:', err);
        setError(err instanceof Error ? err : new Error('Failed to load progress'));
        setIsLoading(false);
      }
    }

    loadProgress();
  }, [user]);

  /**
   * Track video as watched
   */
  const trackVideoWatched = useCallback(async (videoId: string, position: number) => {
    if (!user || !progress) return;
    
    try {
      setIsUpdating(true);
      await markVideoWatched(user.id, videoId, position);
      
      // Update local state
      setProgress(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          watchedVideos: prev.watchedVideos.includes(videoId) 
            ? prev.watchedVideos 
            : [...prev.watchedVideos, videoId]
        };
      });
      
      setIsUpdating(false);
    } catch (err) {
      console.error('Error tracking video:', err);
      setError(err instanceof Error ? err : new Error('Failed to track video'));
      setIsUpdating(false);
    }
  }, [user, progress]);

  /**
   * Track test as completed
   */
  const trackTestCompleted = useCallback(async (
    testId: string, 
    score: number, 
    answers: Array<{ questionId: string; answeredOption: number; isCorrect: boolean }>
  ) => {
    if (!user || !progress) return;
    
    try {
      setIsUpdating(true);
      await markTestCompleted(user.id, testId, score, answers);
      
      // Update local state
      setProgress(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          completedTests: prev.completedTests.includes(testId) 
            ? prev.completedTests 
            : [...prev.completedTests, testId]
        };
      });
      
      setIsUpdating(false);
    } catch (err) {
      console.error('Error tracking test:', err);
      setError(err instanceof Error ? err : new Error('Failed to track test'));
      setIsUpdating(false);
    }
  }, [user, progress]);

  /**
   * Track artifact as downloaded
   */
  const trackArtifactDownloaded = useCallback(async (artifactId: string) => {
    if (!user || !progress) return;
    
    try {
      setIsUpdating(true);
      await markArtifactDownloaded(user.id, artifactId);
      
      // Update local state
      setProgress(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          downloadedArtifacts: prev.downloadedArtifacts.includes(artifactId) 
            ? prev.downloadedArtifacts 
            : [...prev.downloadedArtifacts, artifactId]
        };
      });
      
      setIsUpdating(false);
    } catch (err) {
      console.error('Error tracking artifact:', err);
      setError(err instanceof Error ? err : new Error('Failed to track artifact'));
      setIsUpdating(false);
    }
  }, [user, progress]);

  /**
   * Track level as completed
   */
  const trackLevelCompleted = useCallback(async (levelId: string, levelData: any) => {
    if (!user || !progress) return;
    
    try {
      setIsUpdating(true);
      await completeLevel(user.id, levelId, levelData);
      
      // Reload progress to get updated skills and badges
      const updatedProgress = await getUserProgress(user.id);
      setProgress(updatedProgress);
      
      setIsUpdating(false);
      return true;
    } catch (err) {
      console.error('Error completing level:', err);
      setError(err instanceof Error ? err : new Error('Failed to complete level'));
      setIsUpdating(false);
      return false;
    }
  }, [user, progress]);

  /**
   * Reset user's progress (for testing)
   */
  const resetProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      await resetUserProgress(user.id);
      
      // Reload progress
      const freshProgress = await getUserProgress(user.id);
      setProgress(freshProgress);
      
      setIsUpdating(false);
    } catch (err) {
      console.error('Error resetting progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to reset progress'));
      setIsUpdating(false);
    }
  }, [user]);

  /**
   * Check if a video is watched
   */
  const isVideoWatched = useCallback((videoId: string): boolean => {
    if (!progress) return false;
    return progress.watchedVideos.includes(videoId);
  }, [progress]);

  /**
   * Check if a test is completed
   */
  const isTestCompleted = useCallback((testId: string): boolean => {
    if (!progress) return false;
    return progress.completedTests.includes(testId);
  }, [progress]);

  /**
   * Check if an artifact is downloaded
   */
  const isArtifactDownloaded = useCallback((artifactId: string): boolean => {
    if (!progress) return false;
    return progress.downloadedArtifacts.includes(artifactId);
  }, [progress]);

  /**
   * Check if a level is completed
   */
  const isLevelCompleted = useCallback((levelId: string): boolean => {
    if (!progress) return false;
    return progress.completedLevels.includes(levelId);
  }, [progress]);

  /**
   * Get skill progress percentage
   */
  const getSkillProgress = useCallback((skillType: SkillType): number => {
    if (!progress) return 0;
    return progress.skillProgress[skillType] || 0;
  }, [progress]);

  /**
   * Get all earned badges
   */
  const getEarnedBadges = useCallback((): Badge[] => {
    if (!progress) return [];
    return progress.badges.filter(badge => badge.achieved);
  }, [progress]);

  /**
   * Get formatted skill progress information
   */
  const getFormattedSkillProgress = useCallback((): Array<SkillInfo & { progress: number }> => {
    if (!progress) return [];
    return formatSkillsProgress(progress.skillProgress);
  }, [progress]);

  /**
   * Get top skills by progress
   */
  const getTopSkills = useCallback((count: number = 2): Array<SkillInfo & { progress: number }> => {
    if (!progress) return [];
    const formattedSkills = formatSkillsProgress(progress.skillProgress);
    return formattedSkills
      .sort((a, b) => b.progress - a.progress)
      .slice(0, count);
  }, [progress]);

  /**
   * Get skill recommendations for improvement
   */
  const getSkillRecommendationsForUser = useCallback(() => {
    if (!progress) return [];
    return getSkillRecommendations(
      progress.skillProgress, 
      progress.completedLevels
    );
  }, [progress]);

  return {
    progress,
    isLoading,
    isUpdating,
    error,
    trackVideoWatched,
    trackTestCompleted,
    trackArtifactDownloaded,
    trackLevelCompleted,
    resetProgress,
    isVideoWatched,
    isTestCompleted,
    isArtifactDownloaded,
    isLevelCompleted,
    getSkillProgress,
    getEarnedBadges,
    getFormattedSkillProgress,
    getTopSkills,
    getSkillRecommendationsForUser,
    getSkillsInfo,
    getSkillInfo
  };
} 