/**
 * @file useArtifacts.ts
 * @description Hook for accessing artifact data and user interactions
 * @dependencies lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Artifact, ArtifactFileType, LevelArtifact } from '@/types';
import { getLevels } from '@/lib/data/levels';
import { getUserProgress, isArtifactDownloaded } from '@/lib/data/user-progress';

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
  const { user } = useAuth();
  const [artifacts, setArtifacts] = useState<ArtifactWithMeta[]>([]);
  const [downloadedArtifacts, setDownloadedArtifacts] = useState<string[]>([]);
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
      
      // Get user progress for download status
      if (user) {
        const progress = getUserProgress(user.id);
        
        // Update download status
        allArtifacts.forEach(artifact => {
          artifact.isDownloaded = isArtifactDownloaded(artifact.id, progress);
        });
        
        // Save downloaded artifacts list
        setDownloadedArtifacts(progress.downloadedArtifacts);
      }
      
      setArtifacts(allArtifacts);
      setLoading(false);
    } catch (err) {
      console.error('Error loading artifacts:', err);
      setError(err instanceof Error ? err : new Error('Failed to load artifacts'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback((artifactId: string) => {
    if (!artifactId || !user) return;
    
    // Update local state
    setArtifacts(prev => prev.map(artifact => 
      artifact.id === artifactId 
        ? { ...artifact, isDownloaded: true } 
        : artifact
    ));
    
    setDownloadedArtifacts(prev => 
      prev.includes(artifactId) ? prev : [...prev, artifactId]
    );
    
    // In a real app, we would update this in Firestore
    console.log(`Artifact ${artifactId} marked as downloaded`);
  }, [user]);

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

  /**
   * Check if an artifact is downloaded
   */
  const isDownloaded = useCallback((artifactId: string) => {
    return downloadedArtifacts.includes(artifactId);
  }, [downloadedArtifacts]);

  return {
    artifacts,
    downloadedArtifacts,
    loading,
    error,
    markArtifactDownloaded,
    filterByType,
    searchArtifacts,
    getArtifactsByLevel,
    getDownloadedArtifacts,
    isDownloaded
  };
} 