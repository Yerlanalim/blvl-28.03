/**
 * @file artifact-service.ts
 * @description Service for fetching and managing artifact data from Firestore
 * @dependencies lib/firebase/utils
 */

import { 
  getAllArtifacts,
  getArtifactsByLevel as getArtifactsByLevelFromFirebase,
  createArtifact,
  updateArtifact
} from '@/lib/firebase/utils';
import { Artifact, ArtifactFileType } from '@/types';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get all artifacts
 * 
 * Fetches all artifacts from Firestore
 * 
 * @returns Array of artifact objects
 * @throws Error if fetching fails
 */
export async function getArtifacts(): Promise<Artifact[]> {
  try {
    return await getAllArtifacts();
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    throw error;
  }
}

/**
 * Get artifacts by level ID
 * 
 * Fetches artifacts associated with a specific level
 * 
 * @param levelId - The ID of the level to get artifacts for
 * @returns Array of artifact objects
 * @throws Error if fetching fails
 */
export async function getArtifactsByLevel(levelId: string): Promise<Artifact[]> {
  try {
    return await getArtifactsByLevelFromFirebase(levelId);
  } catch (error) {
    console.error(`Error fetching artifacts for level ${levelId}:`, error);
    throw error;
  }
}

/**
 * Create a new artifact
 * 
 * @param artifactData - The artifact data to create
 * @returns The created artifact
 * @throws Error if creation fails
 */
export async function createNewArtifact(artifactData: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artifact> {
  try {
    return await createArtifact(artifactData);
  } catch (error) {
    console.error('Error creating artifact:', error);
    throw error;
  }
}

/**
 * Update an existing artifact
 * 
 * @param artifactId - The ID of the artifact to update
 * @param artifactData - The updated artifact data
 * @returns The updated artifact
 * @throws Error if update fails
 */
export async function updateExistingArtifact(
  artifactId: string, 
  artifactData: Partial<Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Artifact> {
  try {
    return await updateArtifact(artifactId, artifactData);
  } catch (error) {
    console.error(`Error updating artifact ${artifactId}:`, error);
    throw error;
  }
}

/**
 * Increment artifact download count
 * 
 * Increases the download count for a specific artifact by 1
 * 
 * @param artifactId - The ID of the artifact to update
 * @returns The updated artifact or null if not found
 * @throws Error if update fails
 */
export async function trackArtifactDownload(artifactId: string): Promise<Artifact | null> {
  try {
    // Get the current artifact data
    const docRef = doc(db, 'artifacts', artifactId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    // Increment the download count
    await updateDoc(docRef, {
      downloadCount: increment(1),
      updatedAt: new Date()
    });
    
    // Return the updated artifact
    const updatedSnap = await getDoc(docRef);
    
    return {
      id: updatedSnap.id,
      ...updatedSnap.data()
    } as Artifact;
  } catch (error) {
    console.error(`Error tracking download for artifact ${artifactId}:`, error);
    throw error;
  }
} 