/**
 * @file skill-service.ts
 * @description Service for calculating and managing skill progress
 * @dependencies types/Progress, lib/data/levels
 */

import { SkillType, Level } from '@/types';
import { getLevels } from '@/lib/data/levels';

/**
 * Skill information with display name and description
 */
export interface SkillInfo {
  type: SkillType;
  displayName: string;
  description: string;
  color: string;
}

/**
 * Get all skill information with display names and descriptions
 */
export function getSkillsInfo(): SkillInfo[] {
  return [
    {
      type: SkillType.PERSONAL_SKILLS,
      displayName: 'Личные навыки и развитие',
      description: 'Самоорганизация, управление временем, эмоциональный интеллект',
      color: '#10B981' // Emerald/teal
    },
    {
      type: SkillType.MANAGEMENT,
      displayName: 'Управление и планирование',
      description: 'Стратегия, планирование, управление командой и проектами',
      color: '#3B82F6' // Blue
    },
    {
      type: SkillType.NETWORKING,
      displayName: 'Нетворкинг и связи',
      description: 'Построение деловых связей, нетворкинг, коммуникация',
      color: '#8B5CF6' // Violet
    },
    {
      type: SkillType.CLIENT_WORK,
      displayName: 'Работа с клиентами и продажи',
      description: 'Привлечение и удержание клиентов, продажи, клиентский сервис',
      color: '#EC4899' // Pink
    },
    {
      type: SkillType.FINANCE,
      displayName: 'Финансовое управление',
      description: 'Бюджетирование, финансовое планирование, учет и анализ',
      color: '#F59E0B' // Amber
    },
    {
      type: SkillType.LEGAL,
      displayName: 'Бухгалтерские и юр-е вопросы',
      description: 'Правовые основы бизнеса, налоги, документация',
      color: '#EF4444' // Red
    }
  ];
}

/**
 * Get skill info by type
 */
export function getSkillInfo(skillType: SkillType): SkillInfo {
  const skillsInfo = getSkillsInfo();
  return skillsInfo.find(skill => skill.type === skillType) || skillsInfo[0];
}

/**
 * Get skills affected by a specific level
 */
export function getLevelSkills(levelId: string): SkillType[] {
  const levels = getLevels();
  const level = levels.find(l => l.id === levelId);
  return level ? level.skillsFocus : [];
}

/**
 * Calculate maximum possible skill progress
 * 
 * Returns the maximum progress possible for each skill based on all levels
 */
export function calculateMaxSkillProgress(): Record<SkillType, number> {
  const levels = getLevels();
  const skillCounts: Record<SkillType, number> = {
    [SkillType.PERSONAL_SKILLS]: 0,
    [SkillType.MANAGEMENT]: 0,
    [SkillType.NETWORKING]: 0,
    [SkillType.CLIENT_WORK]: 0,
    [SkillType.FINANCE]: 0,
    [SkillType.LEGAL]: 0
  };
  
  // Count how many levels contribute to each skill
  levels.forEach(level => {
    level.skillsFocus.forEach(skill => {
      skillCounts[skill]++;
    });
  });
  
  // Calculate maximum possible progress (each level gives 10 points)
  const maxProgress: Record<SkillType, number> = {} as Record<SkillType, number>;
  Object.keys(skillCounts).forEach(skill => {
    const skillType = skill as SkillType;
    const totalPoints = skillCounts[skillType] * 10;
    maxProgress[skillType] = Math.min(totalPoints, 100); // Cap at 100%
  });
  
  return maxProgress;
}

/**
 * Calculate skill progress based on completed levels
 * 
 * Takes an array of completed level IDs and calculates skill progress
 */
export function calculateSkillProgress(completedLevelIds: string[]): Record<SkillType, number> {
  const levels = getLevels();
  const completedLevels = levels.filter(level => completedLevelIds.includes(level.id));
  
  // Initialize progress with zeros
  const progress: Record<SkillType, number> = {
    [SkillType.PERSONAL_SKILLS]: 0,
    [SkillType.MANAGEMENT]: 0,
    [SkillType.NETWORKING]: 0,
    [SkillType.CLIENT_WORK]: 0,
    [SkillType.FINANCE]: 0,
    [SkillType.LEGAL]: 0
  };
  
  // For each completed level, add 10 points to each skill in focus
  completedLevels.forEach(level => {
    level.skillsFocus.forEach(skill => {
      progress[skill] += 10;
    });
  });
  
  // Cap progress at 100%
  Object.keys(progress).forEach(skill => {
    const skillType = skill as SkillType;
    progress[skillType] = Math.min(progress[skillType], 100);
  });
  
  return progress;
}

/**
 * Format skill progress for display
 * 
 * Returns skill progress with display names, descriptions, and percentages
 */
export function formatSkillsProgress(progress: Record<SkillType, number>): Array<SkillInfo & { progress: number }> {
  const skillsInfo = getSkillsInfo();
  
  return skillsInfo.map(skill => ({
    ...skill,
    progress: progress[skill.type] || 0
  }));
}

/**
 * Get dominant skills (top skills by progress)
 * 
 * Returns the top N skills by progress percentage
 */
export function getDominantSkills(progress: Record<SkillType, number>, count: number = 2): SkillInfo[] {
  const formattedSkills = formatSkillsProgress(progress);
  
  // Sort by progress (descending) and take top N
  const sortedSkills = [...formattedSkills].sort((a, b) => b.progress - a.progress);
  
  return sortedSkills.slice(0, count);
}

/**
 * Get skill recommendations based on current progress
 * 
 * Returns skills with low progress and recommended levels to improve them
 */
export function getSkillRecommendations(
  progress: Record<SkillType, number>, 
  completedLevelIds: string[]
): Array<SkillInfo & { recommendedLevels: Level[] }> {
  const formattedSkills = formatSkillsProgress(progress);
  const levels = getLevels();
  
  // Filter out completed levels
  const availableLevels = levels.filter(level => !completedLevelIds.includes(level.id));
  
  // Sort skills by progress (ascending to get weakest skills first)
  const sortedSkills = [...formattedSkills].sort((a, b) => a.progress - b.progress);
  
  // Get recommendations for top 3 weakest skills
  return sortedSkills.slice(0, 3).map(skill => {
    // Find levels that focus on this skill
    const recommendedLevels = availableLevels
      .filter(level => level.skillsFocus.includes(skill.type))
      .sort((a, b) => a.order - b.order) // Sort by level order
      .slice(0, 2); // Take up to 2 recommendations per skill
    
    return {
      ...skill,
      recommendedLevels
    };
  });
} 