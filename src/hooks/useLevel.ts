/**
 * @file useLevel.ts
 * @description Hook for accessing individual level data and progress
 * @dependencies hooks/useProgress, lib/data/levels
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import { Level, VideoProgress, LevelStatus } from '@/types';
import { getLevelById } from '@/lib/data/levels';

/**
 * Hook for accessing and managing individual level data
 */
export function useLevel(levelId: string) {
  const { user } = useAuth();
  const { 
    progress, 
    isLoading: progressLoading, 
    isUpdating,
    trackVideoWatched,
    trackTestCompleted,
    trackArtifactDownloaded,
    trackLevelCompleted,
    isVideoWatched,
    isTestCompleted,
    isArtifactDownloaded,
    isLevelCompleted
  } = useProgress();
  
  const [level, setLevel] = useState<Level | null>(null);
  const [levelStatus, setLevelStatus] = useState<LevelStatus>(LevelStatus.LOCKED);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [testProgress, setTestProgress] = useState<Record<string, boolean>>({});
  const [artifactDownloaded, setArtifactDownloaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch level data and determine status
  useEffect(() => {
    if (!levelId) {
      setError(new Error('Level ID is required'));
      setLoading(false);
      return;
    }

    try {
      // Get level data
      const levelData = getLevelById(levelId);
      if (!levelData) {
        setError(new Error(`Level with ID ${levelId} not found`));
        setLoading(false);
        return;
      }
      
      setLevel(levelData);
      
      // Wait for progress to load
      if (progressLoading) {
        return;
      }
      
      // Determine level status
      if (isLevelCompleted(levelId)) {
        setLevelStatus(LevelStatus.COMPLETED);
      } else if (
        progress?.currentLevel === levelId || 
        levelData.order === 1 ||
        (levelData.order > 1 && isLevelCompleted(`level-${levelData.order - 1}`))
      ) {
        setLevelStatus(LevelStatus.AVAILABLE);
      } else {
        setLevelStatus(LevelStatus.LOCKED);
      }
      
      // Initialize video progress
      const videoProgressMap: Record<string, VideoProgress> = {};
      levelData.videos.forEach(video => {
        const watched = isVideoWatched(video.id);
        videoProgressMap[video.id] = {
          videoId: video.id,
          watched,
          position: watched ? video.duration : 0
        };
      });
      setVideoProgress(videoProgressMap);
      
      // Initialize test progress
      const testProgressMap: Record<string, boolean> = {};
      levelData.tests.forEach(test => {
        testProgressMap[test.id] = isTestCompleted(test.id);
      });
      setTestProgress(testProgressMap);
      
      // Initialize artifact download status
      const artifactDownloadMap: Record<string, boolean> = {};
      levelData.artifacts.forEach(artifact => {
        artifactDownloadMap[artifact.id] = isArtifactDownloaded(artifact.id);
      });
      setArtifactDownloaded(artifactDownloadMap);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching level data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch level data'));
      setLoading(false);
    }
  }, [
    levelId, 
    progress, 
    progressLoading, 
    isLevelCompleted, 
    isVideoWatched, 
    isTestCompleted, 
    isArtifactDownloaded
  ]);

  /**
   * Mark a video as watched
   */
  const markVideoWatched = useCallback(async (videoId: string) => {
    if (!videoId || !level) return;
    
    // Mark video as watched in progress system
    await trackVideoWatched(videoId, level.videos.find(v => v.id === videoId)?.duration || 0);
    
    // Update local state
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        watched: true,
        position: level.videos.find(v => v.id === videoId)?.duration || 0
      }
    }));
  }, [level, trackVideoWatched]);

  /**
   * Update video position
   */
  const updateVideoPosition = useCallback(async (videoId: string, position: number) => {
    if (!videoId || !level) return;
    
    // Update local state
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        position
      }
    }));
    
    // If position is >= 90% of duration, mark as watched
    const video = level.videos.find(v => v.id === videoId);
    if (video && position >= video.duration * 0.9 && !videoProgress[videoId]?.watched) {
      await markVideoWatched(videoId);
    }
  }, [level, videoProgress, markVideoWatched]);

  /**
   * Mark a test as completed
   */
  const markTestCompleted = useCallback(async (testId: string, score: number) => {
    if (!testId || !level) return;
    
    // Get the test
    const test = level.tests.find(t => t.id === testId);
    if (!test) return;
    
    // Create dummy answers for simplicity (in a real app, we'd use actual answers)
    const answers = test.questions.map((q, index) => ({
      questionId: q.id,
      answeredOption: q.correctAnswer, // Assume correct answers for simplicity
      isCorrect: true
    }));
    
    // Mark test as completed in progress system
    await trackTestCompleted(testId, score, answers);
    
    // Update local state
    setTestProgress(prev => ({
      ...prev,
      [testId]: true
    }));
  }, [level, trackTestCompleted]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback(async (artifactId: string) => {
    if (!artifactId || !level) return;
    
    // Mark artifact as downloaded in progress system
    await trackArtifactDownloaded(artifactId);
    
    // Update local state
    setArtifactDownloaded(prev => ({
      ...prev,
      [artifactId]: true
    }));
  }, [level, trackArtifactDownloaded]);

  /**
   * Complete the level
   */
  const completeLevel = useCallback(async () => {
    if (!level || !user) return false;
    
    // Track level completion in progress system
    const result = await trackLevelCompleted(level.id, level);
    
    // Update local state if successful
    if (result) {
      setLevelStatus(LevelStatus.COMPLETED);
    }
    
    return result;
  }, [level, user, trackLevelCompleted]);

  /**
   * Check if level can be completed
   */
  const canCompleteLevel = useCallback(() => {
    if (!level) return false;
    
    // Check if already completed
    if (levelStatus === LevelStatus.COMPLETED) return false;
    
    // Check if all videos are watched
    const allVideosWatched = level.videos.every(video => 
      videoProgress[video.id]?.watched
    );
    
    // Check if all tests are completed
    const allTestsCompleted = level.tests.every(test => 
      testProgress[test.id]
    );
    
    // Check if all artifacts are downloaded
    const allArtifactsDownloaded = level.artifacts.every(artifact => 
      artifactDownloaded[artifact.id]
    );
    
    return allVideosWatched && allTestsCompleted && allArtifactsDownloaded;
  }, [level, levelStatus, videoProgress, testProgress, artifactDownloaded]);

  return {
    level,
    levelStatus,
    videoProgress,
    testProgress,
    artifactDownloaded,
    loading: loading || progressLoading,
    isUpdating,
    error,
    markVideoWatched,
    updateVideoPosition,
    markTestCompleted,
    markArtifactDownloaded,
    completeLevel,
    canCompleteLevel
  };
} 