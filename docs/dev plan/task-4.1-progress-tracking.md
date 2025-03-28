# Task 4.1: Implement Progress Tracking System

## Task Details

```
Task: Create system for tracking user progress
Reference: Level Progression System and Database Schema sections in project description
Context: We need to track user actions and update progress
Current Files:
- /types/Progress.ts (Progress tracking types)
- /hooks/useLevel.ts (Level data hook with basic progress)
- /lib/data/user-progress.ts (Mock progress data)
Previous Decision: Track progress for videos, tests, artifacts, and level completion
```

## Context Recovery Steps

1. Review the project description document, particularly the Level Progression System and Database Schema sections:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Progress type definitions:
   ```bash
   cat types/Progress.ts
   ```

4. Review the existing progress-related code:
   ```bash
   cat hooks/useLevel.ts
   cat lib/data/user-progress.ts
   ```

## Implementation Steps

```
1. Create `/lib/services/progress-service.ts` for centralized progress management:

```typescript
/**
 * @file progress-service.ts
 * @description Service for managing user progress throughout the application
 * @dependencies lib/firebase/firestore, types/Progress
 */

import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  arrayUnion, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  UserProgress, 
  VideoProgress, 
  TestProgress, 
  SkillType 
} from '@/types';
import { Level } from '@/types';

// In a real app, these operations would interact with Firestore
// For the MVP, we'll use localStorage to simulate persistence

const STORAGE_KEY = 'bizlevel_user_progress';

/**
 * Initialize user progress
 * 
 * Creates a new progress record for a user
 */
export async function initializeUserProgress(userId: string): Promise<UserProgress> {
  // Create initial progress object
  const initialProgress: UserProgress = {
    userId,
    completedLevels: [],
    currentLevel: 'level-1', // Start with the first level
    skillProgress: {
      [SkillType.PERSONAL_SKILLS]: 0,
      [SkillType.MANAGEMENT]: 0,
      [SkillType.NETWORKING]: 0,
      [SkillType.CLIENT_WORK]: 0,
      [SkillType.FINANCE]: 0,
      [SkillType.LEGAL]: 0
    },
    badges: [],
    downloadedArtifacts: [],
    watchedVideos: [],
    completedTests: [],
    lastUpdated: new Date().toISOString()
  };
  
  // In a real app, we'd save to Firestore:
  // await setDoc(doc(db, 'userProgress', userId), initialProgress);
  
  // For MVP, we'll use localStorage
  localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(initialProgress));
  
  return initialProgress;
}

/**
 * Get user progress
 * 
 * Fetches the current progress for a user
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    // In a real app, we'd fetch from Firestore:
    // const docSnap = await getDoc(doc(db, 'userProgress', userId));
    // if (docSnap.exists()) {
    //   return docSnap.data() as UserProgress;
    // }
    
    // For MVP, we'll use localStorage
    const stored = localStorage.getItem(STORAGE_KEY + '_' + userId);
    
    if (stored) {
      return JSON.parse(stored) as UserProgress;
    }
    
    // If no progress exists, initialize it
    return await initializeUserProgress(userId);
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

/**
 * Mark video as watched
 * 
 * Updates the user's progress to indicate a video has been watched
 */
export async function markVideoWatched(
  userId: string, 
  videoId: string, 
  position: number
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if video is already marked as watched
    if (progress.watchedVideos.includes(videoId)) {
      return; // Already watched, no need to update
    }
    
    // Update progress
    const updatedProgress = {
      ...progress,
      watchedVideos: [...progress.watchedVideos, videoId],
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   watchedVideos: arrayUnion(videoId),
    //   lastUpdated: serverTimestamp()
    // });
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // Log video progress separately
    const videoProgress: VideoProgress = {
      videoId,
      watched: true,
      position,
      completedAt: new Date().toISOString()
    };
    
    // In a real app, we'd store this in a subcollection:
    // await setDoc(doc(db, `userProgress/${userId}/videoProgress`, videoId), videoProgress);
    
    // For MVP, we'll use localStorage
    localStorage.setItem(
      STORAGE_KEY + '_' + userId + '_video_' + videoId, 
      JSON.stringify(videoProgress)
    );
  } catch (error) {
    console.error('Error marking video as watched:', error);
    throw error;
  }
}

/**
 * Mark test as completed
 * 
 * Updates the user's progress to indicate a test has been completed
 */
export async function markTestCompleted(
  userId: string, 
  testId: string, 
  score: number,
  answers: Array<{ questionId: string; answeredOption: number; isCorrect: boolean }>
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if test is already marked as completed
    if (progress.completedTests.includes(testId)) {
      return; // Already completed, no need to update
    }
    
    // Update progress
    const updatedProgress = {
      ...progress,
      completedTests: [...progress.completedTests, testId],
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   completedTests: arrayUnion(testId),
    //   lastUpdated: serverTimestamp()
    // });
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // Log test progress separately
    const testProgress: TestProgress = {
      testId,
      completed: true,
      score,
      answers,
      completedAt: new Date().toISOString()
    };
    
    // In a real app, we'd store this in a subcollection:
    // await setDoc(doc(db, `userProgress/${userId}/testProgress`, testId), testProgress);
    
    // For MVP, we'll use localStorage
    localStorage.setItem(
      STORAGE_KEY + '_' + userId + '_test_' + testId, 
      JSON.stringify(testProgress)
    );
  } catch (error) {
    console.error('Error marking test as completed:', error);
    throw error;
  }
}

/**
 * Mark artifact as downloaded
 * 
 * Updates the user's progress to indicate an artifact has been downloaded
 */
export async function markArtifactDownloaded(
  userId: string, 
  artifactId: string
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if artifact is already marked as downloaded
    if (progress.downloadedArtifacts.includes(artifactId)) {
      return; // Already downloaded, no need to update
    }
    
    // Update progress
    const updatedProgress = {
      ...progress,
      downloadedArtifacts: [...progress.downloadedArtifacts, artifactId],
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   downloadedArtifacts: arrayUnion(artifactId),
    //   lastUpdated: serverTimestamp()
    // });
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // Also update artifact download count (in a real app)
    // await updateDoc(doc(db, 'artifacts', artifactId), {
    //   downloadCount: increment(1)
    // });
  } catch (error) {
    console.error('Error marking artifact as downloaded:', error);
    throw error;
  }
}

/**
 * Complete level
 * 
 * Updates the user's progress to indicate a level has been completed
 * and updates skill progress based on the level's focus areas
 */
export async function completeLevel(
  userId: string, 
  levelId: string,
  level: Level
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if level is already completed
    if (progress.completedLevels.includes(levelId)) {
      return; // Already completed, no need to update
    }
    
    // Determine next level
    const currentLevelNumber = parseInt(levelId.split('-')[1]);
    const nextLevelId = `level-${currentLevelNumber + 1}`;
    
    // Calculate skill progress updates
    const skillUpdates: Partial<Record<SkillType, number>> = {};
    
    // Each skill in focus gets +10 points (max 100)
    level.skillsFocus.forEach(skill => {
      const currentValue = progress.skillProgress[skill] || 0;
      skillUpdates[skill] = Math.min(currentValue + 10, 100);
    });
    
    // Update progress
    const updatedProgress = {
      ...progress,
      completedLevels: [...progress.completedLevels, levelId],
      currentLevel: nextLevelId,
      skillProgress: {
        ...progress.skillProgress,
        ...skillUpdates
      },
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   completedLevels: arrayUnion(levelId),
    //   currentLevel: nextLevelId,
    //   ...Object.entries(skillUpdates).reduce((acc, [skill, value]) => {
    //     acc[`skillProgress.${skill}`] = value;
    //     return acc;
    //   }, {} as Record<string, number>),
    //   lastUpdated: serverTimestamp()
    // });
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // Check and award badges (implemented in a separate function)
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error('Error completing level:', error);
    throw error;
  }
}

/**
 * Check and award badges
 * 
 * Examines the user's progress and awards any earned badges
 */
export async function checkAndAwardBadges(userId: string): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Define badge criteria and check if they're met
    const badgesToAward = [];
    
    // Example: First Level Completion Badge
    if (
      progress.completedLevels.length > 0 && 
      !progress.badges.some(b => b.id === 'badge-first-level')
    ) {
      badgesToAward.push({
        id: 'badge-first-level',
        name: 'First Steps',
        description: 'Completed your first level',
        achieved: true,
        achievedAt: new Date().toISOString()
      });
    }
    
    // Example: Halfway There Badge
    if (
      progress.completedLevels.length >= 5 && 
      !progress.badges.some(b => b.id === 'badge-halfway')
    ) {
      badgesToAward.push({
        id: 'badge-halfway',
        name: 'Halfway There',
        description: 'Completed 5 levels',
        achieved: true,
        achievedAt: new Date().toISOString()
      });
    }
    
    // Example: Resource Collector Badge
    if (
      progress.downloadedArtifacts.length >= 5 && 
      !progress.badges.some(b => b.id === 'badge-collector')
    ) {
      badgesToAward.push({
        id: 'badge-collector',
        name: 'Resource Collector',
        description: 'Downloaded 5 artifacts',
        achieved: true,
        achievedAt: new Date().toISOString()
      });
    }
    
    // If no badges to award, return early
    if (badgesToAward.length === 0) {
      return;
    }
    
    // Update progress with new badges
    const updatedProgress = {
      ...progress,
      badges: [...progress.badges, ...badgesToAward],
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // for (const badge of badgesToAward) {
    //   await updateDoc(doc(db, 'userProgress', userId), {
    //     badges: arrayUnion(badge),
    //     lastUpdated: serverTimestamp()
    //   });
    // }
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // In a real app, we might also send a notification about new badges
    console.log('Badges awarded:', badgesToAward);
  } catch (error) {
    console.error('Error awarding badges:', error);
    throw error;
  }
}

/**
 * Reset user progress (for testing)
 * 
 * Completely resets a user's progress
 */
export async function resetUserProgress(userId: string): Promise<void> {
  try {
    // In a real app, we'd delete from Firestore:
    // await deleteDoc(doc(db, 'userProgress', userId));
    
    // For MVP, we'll remove from localStorage
    localStorage.removeItem(STORAGE_KEY + '_' + userId);
    
    // Initialize fresh progress
    await initializeUserProgress(userId);
  } catch (error) {
    console.error('Error resetting user progress:', error);
    throw error;
  }
}
```

2. Create `/hooks/useProgress.ts` to provide progress tracking functionality:

```typescript
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
    getEarnedBadges
  };
}
```

3. Update `/hooks/useLevel.ts` to use the progress hook:

```typescript
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
```

4. Update `/hooks/useLevels.ts` to use the progress hook:

```typescript
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
```

5. Update `/hooks/useArtifacts.ts` to use the progress hook:

```typescript
/**
 * @file useArtifacts.ts
 * @description Hook for accessing artifact data and user interactions
 * @dependencies lib/data/levels, hooks/useProgress
 */

import { useState, useEffect, useCallback } from 'react';
import { Artifact, ArtifactFileType, LevelArtifact } from '@/types';
import { getLevels } from '@/lib/data/levels';
import { useProgress } from './useProgress';

/**
 * Combined artifact information with level details and download status
 */
export interface ArtifactWithMeta extends Artifact {
  levelTitle: string;
  levelId: string;
  levelOrder: number;
  isDownloaded: boolean;
}

/**
 * Hook for accessing and managing artifact data
 */
export function useArtifacts() {
  const { 
    isLoading: progressLoading,
    isArtifactDownloaded,
    trackArtifactDownloaded
  } = useProgress();
  
  const [artifacts, setArtifacts] = useState<ArtifactWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all artifacts from levels
  useEffect(() => {
    try {
      // Get all levels
      const levels = getLevels();
      
      // Extract artifacts from levels
      const allArtifacts: ArtifactWithMeta[] = [];
      levels.forEach(level => {
        level.artifacts.forEach(artifact => {
          allArtifacts.push({
            id: artifact.id,
            title: artifact.title,
            description: artifact.description,
            fileUrl: artifact.fileUrl,
            fileType: artifact.fileType as ArtifactFileType,
            levelId: level.id,
            levelTitle: level.title,
            levelOrder: level.order,
            isDownloaded: false, // Will be updated below
            createdAt: new Date().toISOString(), // Mock date
            updatedAt: new Date().toISOString(), // Mock date
            downloadCount: 0
          });
        });
      });
      
      // Sort artifacts by level order
      allArtifacts.sort((a, b) => a.levelOrder - b.levelOrder);
      
      // If progress is still loading, we'll wait before setting download status
      if (!progressLoading) {
        // Update download status
        allArtifacts.forEach(artifact => {
          artifact.isDownloaded = isArtifactDownloaded(artifact.id);
        });
        
        setLoading(false);
      }
      
      setArtifacts(allArtifacts);
    } catch (err) {
      console.error('Error loading artifacts:', err);
      setError(err instanceof Error ? err : new Error('Failed to load artifacts'));
      setLoading(false);
    }
  }, [progressLoading, isArtifactDownloaded]);

  // Update download status when progress finishes loading
  useEffect(() => {
    if (!progressLoading && artifacts.length > 0 && loading) {
      setArtifacts(prev => prev.map(artifact => ({
        ...artifact,
        isDownloaded: isArtifactDownloaded(artifact.id)
      })));
      
      setLoading(false);
    }
  }, [progressLoading, artifacts.length, loading, isArtifactDownloaded]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback(async (artifactId: string) => {
    // Track artifact download
    await trackArtifactDownloaded(artifactId);
    
    // Update local state
    setArtifacts(prev => prev.map(artifact => 
      artifact.id === artifactId 
        ? { ...artifact, isDownloaded: true } 
        : artifact
    ));
  }, [trackArtifactDownloaded]);

  /**
   * Filter artifacts by type
   */
  const filterByType = useCallback((fileType?: ArtifactFileType | 'all') => {
    if (!fileType || fileType === 'all') return artifacts;
    return artifacts.filter(a => a.fileType === fileType);
  }, [artifacts]);

  /**
   * Search artifacts by title or description
   */
  const searchArtifacts = useCallback((query: string) => {
    if (!query) return artifacts;
    
    const lowerQuery = query.toLowerCase();
    return artifacts.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.description.toLowerCase().includes(lowerQuery)
    );
  }, [artifacts]);

  /**
   * Get artifacts by level
   */
  const getArtifactsByLevel = useCallback((levelId: string) => {
    return artifacts.filter(a => a.levelId === levelId);
  }, [artifacts]);

  /**
   * Get downloaded artifacts
   */
  const getDownloadedArtifacts = useCallback(() => {
    return artifacts.filter(a => a.isDownloaded);
  }, [artifacts]);

  return {
    artifacts,
    loading: loading || progressLoading,
    error,
    markArtifactDownloaded,
    filterByType,
    searchArtifacts,
    getArtifactsByLevel,
    getDownloadedArtifacts,
    isDownloaded: isArtifactDownloaded
  };
}
```

6. Create a test component to verify progress tracking at `/components/features/admin/ProgressDebugPanel.tsx`:

```typescript
/**
 * @file ProgressDebugPanel.tsx
 * @description Debug panel for testing progress tracking system
 * @dependencies hooks/useProgress, hooks/useLevels
 */

'use client';

import React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useLevels } from '@/hooks/useLevels';
import { SkillType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ProgressDebugPanel component
 * 
 * Allows testing of progress tracking functionality
 */
export function ProgressDebugPanel() {
  const { 
    progress, 
    isLoading, 
    isUpdating,
    resetProgress, 
    getSkillProgress,
    getEarnedBadges
  } = useProgress();
  
  const { levels, getLevelsWithStatus } = useLevels();
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center">Loading progress data...</p>
      </div>
    );
  }
  
  // If no progress, show message
  if (!progress) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center">No progress data available. Please log in.</p>
      </div>
    );
  }
  
  // Get levels with status
  const levelsWithStatus = getLevelsWithStatus();
  
  // Get skill progress
  const skills = Object.values(SkillType).map(skill => ({
    type: skill,
    progress: getSkillProgress(skill)
  }));
  
  // Get earned badges
  const badges = getEarnedBadges();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Progress Debug Panel</span>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={resetProgress}
              disabled={isUpdating}
            >
              Reset Progress
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current progress overview */}
          <div>
            <h3 className="text-lg font-medium mb-2">Current Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Current Level:</p>
                <p className="text-sm">{progress.currentLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed Levels:</p>
                <p className="text-sm">{progress.completedLevels.length} of {levels.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Watched Videos:</p>
                <p className="text-sm">{progress.watchedVideos.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed Tests:</p>
                <p className="text-sm">{progress.completedTests.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Downloaded Artifacts:</p>
                <p className="text-sm">{progress.downloadedArtifacts.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Earned Badges:</p>
                <p className="text-sm">{badges.length}</p>
              </div>
            </div>
          </div>
          
          {/* Skill progress */}
          <div>
            <h3 className="text-lg font-medium mb-2">Skill Progress</h3>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.type} className="flex items-center space-x-2">
                  <span className="text-sm w-40">{skill.type}:</span>
                  <div className="h-2 bg-gray-200 rounded-full flex-1">
                    <div 
                      className="h-2 bg-teal-500 rounded-full" 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-10 text-right">{skill.progress}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Level status */}
          <div>
            <h3 className="text-lg font-medium mb-2">Level Status</h3>
            <div className="grid grid-cols-5 gap-2">
              {levelsWithStatus.map(level => (
                <div 
                  key={level.id} 
                  className={`p-2 rounded text-center text-sm ${
                    level.status === 'completed' ? 'bg-green-100 text-green-800' :
                    level.status === 'available' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  Level {level.order}
                  <span className="block text-xs capitalize">{level.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Badges */}
          {badges.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Earned Badges</h3>
              <div className="grid grid-cols-3 gap-2">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className="p-2 bg-amber-100 text-amber-800 rounded"
                  >
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

7. Create a simple debug page at `/app/(main)/debug/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Debug page for testing progress tracking
 * @dependencies components/features/admin/ProgressDebugPanel
 */

import { ProgressDebugPanel } from '@/components/features/admin/ProgressDebugPanel';

export default function DebugPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Debug Tools</h1>
      <p className="text-gray-600">
        This page contains tools for testing system functionality.
      </p>
      
      <ProgressDebugPanel />
    </div>
  );
}
```

## Expected Output

```
- Progress tracking system files:
  - /lib/services/progress-service.ts (Progress service implementation)
  - /hooks/useProgress.ts (Hook for progress management)
  - /hooks/useLevel.ts (Updated to use progress hook)
  - /hooks/useLevels.ts (Updated to use progress hook)
  - /hooks/useArtifacts.ts (Updated to use progress hook)
  - /components/features/admin/ProgressDebugPanel.tsx (Debug component)
  - /app/(main)/debug/page.tsx (Debug page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Progress tracking system implementation

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout
   - Task 2.2: Build Level Map Component
   - Task 2.3: Implement Profile Page
   - Task 2.4: Build Level Detail Page
   - Task 3.1: Implement Artifacts System
   - Task 3.2: Implement Chat Interface
   - Task 3.3: Implement Settings Page
   - Task 3.4: Create FAQ Page
   - Task 4.1: Implement Progress Tracking System

   ## Current Issues
   - None

   ## Next Up
   - Task 4.2: Implement Skill Progress Calculation

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Complete (Account settings, preferences, and notifications)
   - FAQ: Complete (Categorized FAQs with search functionality)
   - Progress Tracking: Complete (Tracking system for videos, tests, artifacts, and levels)
   ```

2. Create `/docs/features/progress-tracking.md` with a description of the progress tracking system:
   ```markdown
   # Progress Tracking System

   ## Overview
   This document describes the progress tracking system, which manages user progress through the learning platform including video views, test completions, artifact downloads, level completion, and skill development.

   ## Components

   ### 1. Progress Service
   - Centralized service for all progress-related operations
   - Handles data persistence (localStorage in MVP, Firestore in production)
   - Provides atomic operations for updating different aspects of progress
   - Manages skill progress calculation and badge awards

   ### 2. Progress Hook
   - React hook for accessing progress data and operations
   - Provides loading, updating, and error states
   - Exposes functions for tracking various user actions
   - Includes helper functions for checking completion status

   ### 3. Debug Panel
   - Administrative component for testing progress functionality
   - Displays current progress state
   - Allows resetting progress for testing
   - Shows level status, skill progress, and earned badges

   ## Progress Tracking Types

   ### 1. Video Tracking
   - Tracks which videos have been watched
   - Stores progress position within videos
   - Auto-marks videos as watched at 90% completion
   - Records completion timestamp

   ### 2. Test Tracking
   - Tracks completed tests
   - Stores test scores and answers
   - Records completion timestamp
   - Used for level completion requirements

   ### 3. Artifact Tracking
   - Tracks downloaded artifacts
   - Used for level completion requirements
   - Updates artifact download count statistics

   ### 4. Level Completion
   - Marks levels as completed
   - Updates skill progress based on level focus
   - Unlocks next level
   - Triggers badge awarding check

   ### 5. Skill Progress
   - Tracks progress across six skill categories
   - Updates based on completed levels
   - Visualized in profile and debug panel
   - Used for personalization and achievement tracking

   ### 6. Badges
   - Awarded based on user achievements
   - Triggers on level completion and other milestones
   - Displayed in profile and debug panel

   ## Implementation Details

   ### Data Persistence
   - MVP: Uses localStorage for persistence between sessions
   - Production: Will use Firestore for cloud storage and synchronization
   - Structured to allow easy migration between storage systems

   ### User Flow
   1. User interacts with content (watches video, takes test, etc.)
   2. Action is tracked via relevant hook function
   3. Progress is updated in service and persisted
   4. UI components react to progress changes
   5. Badges are awarded when criteria are met

   ### Performance Considerations
   - Optimized to minimize unnecessary updates
   - Loading states to handle asynchronous operations
   - Caching to reduce storage operations
   ```

3. Create a snapshot document at `/docs/snapshots/progress-tracking.md`:
   ```markdown
   # Progress Tracking System Snapshot

   ## Purpose
   Track user progress through the learning platform for gamification and personalization

   ## Key Files
   - `/lib/services/progress-service.ts` - Core progress tracking service
   - `/hooks/useProgress.ts` - Hook for progress management
   - `/hooks/useLevel.ts` - Updated to use progress hook
   - `/hooks/useLevels.ts` - Updated to use progress hook
   - `/hooks/useArtifacts.ts` - Updated to use progress hook
   - `/components/features/admin/ProgressDebugPanel.tsx` - Debug component

   ## State Management
   - Progress data stored in localStorage (MVP) or Firestore (production)
   - React hooks provide component access to progress data
   - Loading and updating states for asynchronous operations
   - Centralized service for data consistency

   ## Data Flow
   1. User performs action (watches video, completes test, etc.)
   2. Component calls appropriate tracking function from hook
   3. Hook calls progress service to update data
   4. Service persists changes and calculates derived data (skills, badges)
   5. Updated data flows back to components through hooks
   6. UI updates to reflect progress changes

   ## Key Decisions
   - Separation of concerns between UI and data management
   - Centralized service for consistent data operations
   - Local storage for MVP to avoid Firebase dependency
   - Hook-based API for React component integration
   - Automatic skill progress calculation based on level completion

   ## Usage Example
   ```tsx
   import { useProgress } from '@/hooks/useProgress';

   function VideoComponent({ videoId, duration }) {
     const { trackVideoWatched, isVideoWatched } = useProgress();
     
     const handleVideoComplete = () => {
       trackVideoWatched(videoId, duration);
     };
     
     return (
       <div>
         <video onEnded={handleVideoComplete}>...</video>
         {isVideoWatched(videoId) && <div>✓ Watched</div>}
       </div>
     );
   }
   ```

   ## Known Issues
   - localStorage has limited storage capacity
   - No offline sync capabilities in MVP
   - Will need migration strategy when moving to Firestore
   ```

## Testing Instructions

1. Test the progress tracking system:
   - Run the development server
   - Navigate to the debug page (`/debug`)
   - Verify that the progress debug panel displays user progress

2. Test video tracking:
   - Navigate to a level page
   - Watch a video or click "Mark as Watched"
   - Verify that the video is marked as watched in the debug panel
   - Check that the watched video count increases

3. Test test completion:
   - Complete a test in a level
   - Verify that the test is marked as completed in the debug panel
   - Check that the completed test count increases

4. Test artifact downloading:
   - Download an artifact from a level or the artifacts page
   - Verify that the artifact is marked as downloaded in the debug panel
   - Check that the downloaded artifact count increases

5. Test level completion:
   - Complete all requirements for a level (videos, tests, artifacts)
   - Click "Complete Level" button
   - Verify that the level is marked as completed in the debug panel
   - Check that the skill progress increases for relevant skills
   - Verify that the next level is unlocked

6. Test progress reset:
   - Click "Reset Progress" in the debug panel
   - Verify that all progress is reset to initial state
   - Check that level 1 is available and all others are locked
