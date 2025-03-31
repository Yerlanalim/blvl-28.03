/**
 * @file useArtifacts.ts
 * @description Hook for accessing artifact data and user interactions with React Query
 * @dependencies lib/services/artifact-service, hooks/useProgress, @tanstack/react-query
 */

import { useCallback } from 'react';
import { Artifact, ArtifactFileType } from '@/types';
import { 
  getArtifacts, 
  getArtifactsByLevel, 
  trackArtifactDownload 
} from '@/lib/services/artifact-service';
import { getLevels } from '@/lib/services/level-service';
import { useProgress } from './useProgress';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
 * Hook for accessing and managing artifact data with React Query
 */
export function useArtifacts() {
  const { 
    progress,
    isLoading: progressLoading,
    isArtifactDownloaded,
    trackArtifactDownloaded
  } = useProgress();
  
  const queryClient = useQueryClient();
  
  // Query for fetching all artifacts
  const { 
    data: rawArtifacts = [], 
    isLoading: artifactsLoading, 
    error 
  } = useQuery({
    queryKey: ['artifacts'],
    queryFn: getArtifacts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Query for fetching all levels (needed for metadata)
  const { 
    data: levels = [],
    isLoading: levelsLoading
  } = useQuery({
    queryKey: ['levels'],
    queryFn: getLevels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Combined loading state
  const isLoading = artifactsLoading || levelsLoading || progressLoading;
  
  /**
   * Get full artifacts with metadata
   */
  const getFullArtifacts = useCallback((): ArtifactWithMeta[] => {
    if (isLoading || !progress) return [];
    
    return rawArtifacts.map(artifact => {
      // Find the level this artifact belongs to
      const level = levels.find(l => l.id === artifact.levelId);
      
      return {
        ...artifact,
        levelTitle: level?.title || 'Unknown Level',
        levelId: artifact.levelId || 'unknown',
        levelOrder: level?.order || 0,
        isDownloaded: isArtifactDownloaded(artifact.id)
      };
    }).sort((a, b) => a.levelOrder - b.levelOrder);
  }, [rawArtifacts, levels, isLoading, progress, isArtifactDownloaded]);
  
  // Memoized artifacts with metadata
  const artifacts = getFullArtifacts();

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback(async (artifactId: string) => {
    try {
      // Обновить счетчик скачиваний в Firebase
      await trackArtifactDownload(artifactId);
      
      // Отметить артефакт как скачанный в локальном прогрессе пользователя
      await trackArtifactDownloaded(artifactId);
      
      // Инвалидировать кэш React Query для артефактов
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    } catch (error) {
      console.error('Error marking artifact as downloaded:', error);
    }
  }, [trackArtifactDownloaded, queryClient]);

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
  const getArtifactsByLevelId = useCallback((levelId: string) => {
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
    isLoading,
    error,
    markArtifactDownloaded,
    filterByType,
    searchArtifacts,
    getArtifactsByLevel: getArtifactsByLevelId,
    getDownloadedArtifacts,
    isDownloaded: isArtifactDownloaded
  };
} 