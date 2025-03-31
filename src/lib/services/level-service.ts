/**
 * @file level-service.ts
 * @description Service for fetching and managing level data from Firestore
 * @dependencies lib/firebase/firestore
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Level, LevelStatus } from '@/types';

/**
 * Get all levels
 * 
 * Fetches all levels from Firestore ordered by their order property
 * 
 * @returns Array of level objects
 * @throws Error if fetching fails
 */
export async function getLevels(): Promise<Level[]> {
  try {
    const levelsQuery = query(
      collection(db, 'levels'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(levelsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as Level;
    });
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
}

/**
 * Get level by ID
 * 
 * Fetches a specific level from Firestore by its ID
 * 
 * @param levelId - The ID of the level to fetch
 * @returns The level object or null if not found
 * @throws Error if fetching fails
 */
export async function getLevelById(levelId: string): Promise<Level | null> {
  try {
    const docRef = doc(db, 'levels', levelId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Level;
  } catch (error) {
    console.error(`Error fetching level ${levelId}:`, error);
    throw error;
  }
}

/**
 * Get level status
 * 
 * Determines the status of a level based on completed levels and current level
 * 
 * @param levelId - The ID of the level to check
 * @param completedLevels - Array of completed level IDs
 * @param currentLevel - ID of the current level
 * @returns The status of the level (LOCKED, AVAILABLE, or COMPLETED)
 */
export function getLevelStatus(
  levelId: string, 
  completedLevels: string[], 
  currentLevel: string
): LevelStatus {
  // If the level is completed
  if (completedLevels.includes(levelId)) {
    return LevelStatus.COMPLETED;
  }
  
  // If this is the current level or level 1
  if (currentLevel === levelId || levelId === 'level-1') {
    return LevelStatus.AVAILABLE;
  }
  
  // Extract level numbers for comparison
  const levelNumber = parseInt(levelId.split('-')[1]);
  const previousLevelId = `level-${levelNumber - 1}`;
  
  // If the previous level is completed, this level is available
  if (levelNumber > 1 && completedLevels.includes(previousLevelId)) {
    return LevelStatus.AVAILABLE;
  }
  
  // Otherwise, the level is locked
  return LevelStatus.LOCKED;
} 