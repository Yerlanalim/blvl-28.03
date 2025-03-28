/**
 * @file Progress.ts
 * @description Type definitions for tracking user progress, skills, and achievements
 */

import { SkillType } from './Level';

// Badge or achievement
export interface Badge {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  achievedAt?: Date | string;
}

// Skill progress tracking
export interface SkillProgress {
  [SkillType.PERSONAL_SKILLS]: number;
  [SkillType.MANAGEMENT]: number;
  [SkillType.NETWORKING]: number;
  [SkillType.CLIENT_WORK]: number;
  [SkillType.FINANCE]: number;
  [SkillType.LEGAL]: number;
}

// User's overall progress
export interface UserProgress {
  userId: string;
  completedLevels: string[];
  currentLevel: string;
  skillProgress: SkillProgress;
  badges: Badge[];
  downloadedArtifacts: string[];
  watchedVideos: string[];
  completedTests: string[];
  lastUpdated: Date | string;
}

// Video progress
export interface VideoProgress {
  videoId: string;
  watched: boolean;
  position: number; // playback position in seconds
  completedAt?: Date | string;
}

// Test progress
export interface TestProgress {
  testId: string;
  completed: boolean;
  score: number;
  answers: {
    questionId: string;
    answeredOption: number;
    isCorrect: boolean;
  }[];
  completedAt?: Date | string;
} 