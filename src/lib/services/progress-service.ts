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
  serverTimestamp,
  writeBatch,
  FieldValue,
  deleteDoc
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

// Storage key for any fallback localStorage operations
const STORAGE_KEY = 'bizlevel_user_progress';

/**
 * Initialize user progress
 * 
 * Creates a new progress record for a user in Firestore
 * 
 * @param userId - The user ID to create progress for
 * @returns The initialized user progress
 * @throws Error if the initialization fails
 */
export async function initializeUserProgress(userId: string): Promise<UserProgress> {
  try {
    // Create initial progress object with data for Firestore
    const initialProgressData = {
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
      lastUpdated: serverTimestamp()
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'userProgress', userId), initialProgressData);
    
    // Return the progress with proper Date for lastUpdated for the client
    const initialProgress: UserProgress = {
      ...initialProgressData,
      lastUpdated: new Date().toISOString()
    };
    
    return initialProgress;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
}

/**
 * Get user progress
 * 
 * Fetches the current progress for a user from Firestore
 * 
 * @param userId - The user ID to get progress for
 * @returns The user's progress or null if not found
 * @throws Error if fetching fails
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    // Fetch from Firestore
    const docSnap = await getDoc(doc(db, 'userProgress', userId));
    
    if (docSnap.exists()) {
      // Transform any Firestore timestamps to strings for the client
      const data = docSnap.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated instanceof Date 
          ? data.lastUpdated.toISOString() 
          : typeof data.lastUpdated === 'object' && data.lastUpdated !== null
            ? new Date(data.lastUpdated.seconds * 1000).toISOString()
            : data.lastUpdated
      } as UserProgress;
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
 * Updates the user's progress in Firestore to indicate a video has been watched
 * 
 * @param userId - The user ID
 * @param videoId - The video ID that was watched
 * @param position - The position in the video (seconds)
 * @throws Error if the update fails
 */
export async function markVideoWatched(
  userId: string, 
  videoId: string, 
  position: number
): Promise<void> {
  try {
    // Get current progress to check if already watched
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if video is already marked as watched
    if (progress.watchedVideos.includes(videoId)) {
      return; // Already watched, no need to update
    }
    
    // Update Firestore document
    await updateDoc(doc(db, 'userProgress', userId), {
      watchedVideos: arrayUnion(videoId),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking video as watched:', error);
    throw error;
  }
}

/**
 * Mark test as completed
 * 
 * Updates the user's progress in Firestore to indicate a test has been completed
 * 
 * @param userId - The user ID
 * @param testId - The test ID that was completed
 * @param score - The test score
 * @param answers - Array of user answers with correctness info
 * @throws Error if the update fails
 */
export async function markTestCompleted(
  userId: string, 
  testId: string, 
  score: number,
  answers: Array<{ questionId: string; answeredOption: number; isCorrect: boolean }>
): Promise<void> {
  try {
    // Get current progress to check if already completed
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if test is already marked as completed
    if (progress.completedTests.includes(testId)) {
      return; // Already completed, no need to update
    }
    
    // Update Firestore document
    await updateDoc(doc(db, 'userProgress', userId), {
      completedTests: arrayUnion(testId),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking test as completed:', error);
    throw error;
  }
}

/**
 * Mark artifact as downloaded
 * 
 * Updates the user's progress and artifact download count in Firestore
 * 
 * @param userId - The user ID
 * @param artifactId - The artifact ID that was downloaded
 * @throws Error if the update fails
 */
export async function markArtifactDownloaded(
  userId: string, 
  artifactId: string
): Promise<void> {
  try {
    // Get current progress to check if already downloaded
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if artifact is already marked as downloaded
    if (progress.downloadedArtifacts.includes(artifactId)) {
      return; // Already downloaded, no need to update
    }
    
    // Use a batch write to update both the user progress and artifact document
    const batch = writeBatch(db);
    
    // Update user progress
    const userProgressRef = doc(db, 'userProgress', userId);
    batch.update(userProgressRef, {
      downloadedArtifacts: arrayUnion(artifactId),
      lastUpdated: serverTimestamp()
    });
    
    // Update artifact download count
    const artifactRef = doc(db, 'artifacts', artifactId);
    batch.update(artifactRef, {
      downloadCount: increment(1)
    });
    
    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error marking artifact as downloaded:', error);
    throw error;
  }
}

/**
 * Complete level
 * 
 * Updates the user's progress in Firestore to indicate a level has been completed
 * and updates skill progress based on the level's focus areas
 * 
 * @param userId - The user ID
 * @param levelId - The level ID that was completed
 * @param level - The level data
 * @throws Error if the update fails
 */
export async function completeLevel(
  userId: string, 
  levelId: string,
  level: Level
): Promise<void> {
  try {
    // Get current progress to check if already completed
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if level is already completed
    if (progress.completedLevels.includes(levelId)) {
      return; // Already completed, no need to update
    }
    
    // Determine next level
    const currentLevelNumber = parseInt(levelId.split('-')[1]);
    const nextLevelId = `level-${currentLevelNumber + 1}`;
    
    // Calculate updated skill progress from all completed levels plus this one
    const updatedCompletedLevels = [...progress.completedLevels, levelId];
    const updatedSkillProgress = calculateSkillProgress(updatedCompletedLevels);
    
    // Use a batch write for atomicity
    const batch = writeBatch(db);
    const userProgressRef = doc(db, 'userProgress', userId);
    
    // Prepare update data
    const updateData = {
      completedLevels: arrayUnion(levelId),
      currentLevel: nextLevelId,
      skillProgress: updatedSkillProgress,
      lastUpdated: serverTimestamp()
    };
    
    // Apply the update
    batch.update(userProgressRef, updateData);
    
    // Commit the batch
    await batch.commit();
    
    // Check and award badges would go here in Task 6.6
    // await checkAndAwardBadges(userId);
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
  // Implementation for Task 6.6
}

/**
 * Reset user progress (for testing)
 * 
 * Completely resets a user's progress in Firestore
 * 
 * @param userId - The user ID to reset progress for
 * @throws Error if reset fails
 */
export async function resetUserProgress(userId: string): Promise<void> {
  try {
    // Delete existing user progress document
    const userProgressRef = doc(db, 'userProgress', userId);
    await deleteDoc(userProgressRef);
    
    // Initialize fresh progress
    await initializeUserProgress(userId);
  } catch (error) {
    console.error('Error resetting user progress:', error);
    throw error;
  }
} 