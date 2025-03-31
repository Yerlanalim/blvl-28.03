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
import { calculateSkillProgress } from './skill-service';

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
    
    // Update completed levels
    const updatedCompletedLevels = [...progress.completedLevels, levelId];
    
    // Calculate skill progress from all completed levels
    const updatedSkillProgress = calculateSkillProgress(updatedCompletedLevels);
    
    // Update progress
    const updatedProgress = {
      ...progress,
      completedLevels: updatedCompletedLevels,
      currentLevel: nextLevelId,
      skillProgress: updatedSkillProgress,
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   completedLevels: arrayUnion(levelId),
    //   currentLevel: nextLevelId,
    //   skillProgress: updatedSkillProgress,
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