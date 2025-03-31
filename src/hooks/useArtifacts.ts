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