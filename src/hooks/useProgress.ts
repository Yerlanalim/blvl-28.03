/**
 * @file useProgress.ts
 * @description Hook for accessing and updating user progress with React Query
 * @dependencies lib/services/progress-service, @tanstack/react-query
 */

import { useCallback } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook for accessing and updating user progress with React Query
 */
export function useProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query key for user progress
  const progressQueryKey = user ? ['userProgress', user.id] : null;
  
  // Get user progress query
  const { 
    data: progress, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: progressQueryKey,
    queryFn: () => getUserProgress(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mark video as watched mutation
  const videoMutation = useMutation({
    mutationFn: ({ videoId, position }: { videoId: string, position: number }) => 
      markVideoWatched(user!.id, videoId, position),
    onSuccess: () => {
      // Invalidate the user progress query to trigger a refetch
      if (progressQueryKey) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey });
      }
    },
  });

  // Mark test as completed mutation
  const testMutation = useMutation({
    mutationFn: ({ 
      testId, 
      score, 
      answers 
    }: { 
      testId: string, 
      score: number, 
      answers: Array<{ questionId: string; answeredOption: number; isCorrect: boolean }> 
    }) => markTestCompleted(user!.id, testId, score, answers),
    onSuccess: () => {
      if (progressQueryKey) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey });
      }
    },
  });

  // Mark artifact as downloaded mutation
  const artifactMutation = useMutation({
    mutationFn: (artifactId: string) => markArtifactDownloaded(user!.id, artifactId),
    onSuccess: () => {
      if (progressQueryKey) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey });
      }
    },
  });

  // Complete level mutation
  const levelMutation = useMutation({
    mutationFn: ({ levelId, levelData }: { levelId: string, levelData: any }) => 
      completeLevel(user!.id, levelId, levelData),
    onSuccess: () => {
      if (progressQueryKey) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey });
      }
    },
  });

  // Reset progress mutation
  const resetMutation = useMutation({
    mutationFn: () => resetUserProgress(user!.id),
    onSuccess: () => {
      if (progressQueryKey) {
        queryClient.invalidateQueries({ queryKey: progressQueryKey });
      }
    },
  });

  /**
   * Track video as watched
   */
  const trackVideoWatched = useCallback((videoId: string, position: number) => {
    if (!user) return;
    videoMutation.mutate({ videoId, position });
  }, [user, videoMutation]);

  /**
   * Track test as completed
   */
  const trackTestCompleted = useCallback((
    testId: string, 
    score: number, 
    answers: Array<{ questionId: string; answeredOption: number; isCorrect: boolean }>
  ) => {
    if (!user) return;
    testMutation.mutate({ testId, score, answers });
  }, [user, testMutation]);

  /**
   * Track artifact as downloaded
   */
  const trackArtifactDownloaded = useCallback((artifactId: string) => {
    if (!user) return;
    artifactMutation.mutate(artifactId);
  }, [user, artifactMutation]);

  /**
   * Track level as completed
   */
  const trackLevelCompleted = useCallback(async (levelId: string, levelData: any) => {
    if (!user) return false;
    try {
      await levelMutation.mutateAsync({ levelId, levelData });
      return true;
    } catch (error) {
      console.error('Error completing level:', error);
      return false;
    }
  }, [user, levelMutation]);

  /**
   * Reset user's progress (for testing)
   */
  const resetProgress = useCallback(() => {
    if (!user) return;
    resetMutation.mutate();
  }, [user, resetMutation]);

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

  // Calculate the overall updating state
  const isUpdating = 
    videoMutation.isPending || 
    testMutation.isPending || 
    artifactMutation.isPending || 
    levelMutation.isPending || 
    resetMutation.isPending;

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
    getSkillInfo,
    refetchProgress: refetch
  };
} 