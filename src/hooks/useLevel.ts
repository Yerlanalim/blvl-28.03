/**
 * @file useLevel.ts
 * @description Hook for accessing and managing individual level data and user progress
 * @dependencies hooks/useAuth, lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { Level, LevelStatus, VideoProgress, Test } from '@/types';
import { getLevelById } from '@/lib/data/levels';
import { 
  getUserProgress, 
  isVideoWatched, 
  isTestCompleted, 
  isArtifactDownloaded 
} from '@/lib/data/user-progress';
import { useAuth } from './useAuth';

/**
 * Hook for accessing and managing individual level data
 */
export function useLevel(levelId: string) {
  const { user } = useAuth();
  const [level, setLevel] = useState<Level | null>(null);
  const [levelStatus, setLevelStatus] = useState<LevelStatus>(LevelStatus.LOCKED);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [testProgress, setTestProgress] = useState<Record<string, boolean>>({});
  const [artifactDownloaded, setArtifactDownloaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch level data and progress
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
      
      // Get user progress
      if (user) {
        const progress = getUserProgress(user.id);
        
        // Determine level status
        if (progress.completedLevels.includes(levelId)) {
          setLevelStatus(LevelStatus.COMPLETED);
        } else if (progress.currentLevel === levelId || levelData.order === 1) {
          setLevelStatus(LevelStatus.AVAILABLE);
        } else {
          setLevelStatus(LevelStatus.LOCKED);
        }
        
        // Initialize video progress
        const videoProgressMap: Record<string, VideoProgress> = {};
        levelData.videos.forEach(video => {
          const isWatched = isVideoWatched(video.id, progress);
          videoProgressMap[video.id] = {
            videoId: video.id,
            watched: isWatched,
            position: isWatched ? video.duration : 0
          };
        });
        setVideoProgress(videoProgressMap);
        
        // Initialize test progress
        const testProgressMap: Record<string, boolean> = {};
        levelData.tests.forEach(test => {
          testProgressMap[test.id] = isTestCompleted(test.id, progress);
        });
        setTestProgress(testProgressMap);
        
        // Initialize artifact download status
        const artifactDownloadMap: Record<string, boolean> = {};
        levelData.artifacts.forEach(artifact => {
          artifactDownloadMap[artifact.id] = isArtifactDownloaded(artifact.id, progress);
        });
        setArtifactDownloaded(artifactDownloadMap);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching level data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch level data'));
      setLoading(false);
    }
  }, [levelId, user]);

  /**
   * Mark a video as watched
   */
  const markVideoWatched = useCallback((videoId: string) => {
    if (!user || !level) return;
    
    // Update local state
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        watched: true,
        position: level.videos.find(v => v.id === videoId)?.duration || 0
      }
    }));
    
    // In a real app, you would update the backend here
    console.log(`Marking video ${videoId} as watched for user ${user.id}`);
  }, [user, level]);

  /**
   * Update a video's position
   */
  const updateVideoPosition = useCallback((videoId: string, position: number) => {
    if (!user) return;
    
    // Update local state
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        position
      }
    }));
    
    // In a real app, you would update the backend here
    console.log(`Updating video ${videoId} position to ${position}s for user ${user.id}`);
  }, [user]);

  /**
   * Mark a test as completed
   */
  const markTestCompleted = useCallback((testId: string, score: number) => {
    if (!user) return;
    
    // Update local state
    setTestProgress(prev => ({
      ...prev,
      [testId]: true
    }));
    
    // In a real app, you would update the backend here
    console.log(`Marking test ${testId} as completed with score ${score} for user ${user.id}`);
  }, [user]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback((artifactId: string) => {
    if (!user) return;
    
    // Update local state
    setArtifactDownloaded(prev => ({
      ...prev,
      [artifactId]: true
    }));
    
    // In a real app, you would update the backend here
    console.log(`Marking artifact ${artifactId} as downloaded for user ${user.id}`);
  }, [user]);

  /**
   * Check if all videos are watched, all tests completed, and all artifacts downloaded
   */
  const canCompleteLevel = useCallback(() => {
    if (!level) return false;
    
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
  }, [level, videoProgress, testProgress, artifactDownloaded]);

  /**
   * Complete the level
   */
  const completeLevel = useCallback(() => {
    if (!user || !level || !canCompleteLevel()) return false;
    
    // Update level status
    setLevelStatus(LevelStatus.COMPLETED);
    
    // In a real app, you would update the backend here
    console.log(`Marking level ${level.id} as completed for user ${user.id}`);
    
    return true;
  }, [user, level, canCompleteLevel]);

  return {
    level,
    levelStatus,
    videoProgress,
    testProgress,
    artifactDownloaded,
    loading,
    error,
    markVideoWatched,
    updateVideoPosition,
    markTestCompleted,
    markArtifactDownloaded,
    completeLevel,
    canCompleteLevel
  };
} 