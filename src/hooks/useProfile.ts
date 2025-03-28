/**
 * @file useProfile.ts
 * @description Hook for accessing user profile and progress data
 * @dependencies hooks/useAuth, lib/data/user-progress
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserProgress } from '@/lib/data/user-progress';
import { User, UserProgress, SkillType } from '@/types';

/**
 * Hook for accessing and managing user profile data
 */
export function useProfile() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user progress data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would be a Firestore query
      const progress = getUserProgress(user.id);
      setUserProgress(progress);
      setLoading(false);
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to load profile data'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Format skill name for display
   */
  const formatSkillName = (skillType: SkillType): string => {
    switch (skillType) {
      case SkillType.PERSONAL_SKILLS:
        return 'Личные навыки и развитие';
      case SkillType.MANAGEMENT:
        return 'Управление и планирование';
      case SkillType.NETWORKING:
        return 'Нетворкинг и связи';
      case SkillType.CLIENT_WORK:
        return 'Работа с клиентами и продажи';
      case SkillType.FINANCE:
        return 'Финансовое управление';
      case SkillType.LEGAL:
        return 'Бухгалтерские и юр-е вопросы';
      default:
        return skillType;
    }
  };

  /**
   * Get all skills with formatted names and progress values
   */
  const getFormattedSkills = () => {
    if (!userProgress) return [];

    return Object.entries(userProgress.skillProgress).map(([key, value]) => ({
      type: key as SkillType,
      name: formatSkillName(key as SkillType),
      progress: value
    }));
  };

  /**
   * Calculate overall progress percentage
   */
  const getOverallProgress = (): number => {
    if (!userProgress) return 0;
    
    const completedCount = userProgress.completedLevels.length;
    // Assuming 10 total levels
    return Math.round((completedCount / 10) * 100);
  };

  return {
    user,
    userProgress,
    loading,
    error,
    getFormattedSkills,
    getOverallProgress,
    completedLevelsCount: userProgress?.completedLevels.length || 0,
    badges: userProgress?.badges || []
  };
} 