/**
 * @file Level.ts
 * @description Type definitions for levels, videos, tests, and level status
 */

// Video content in a level
export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: number; // in seconds
  order: number; // position in level
}

// Question in a test
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

// Test after a video
export interface Test {
  id: string;
  afterVideoId: string; // which video this test follows
  questions: Question[];
}

// Artifact within a level
export interface LevelArtifact {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
}

// Level status
export enum LevelStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  COMPLETED = 'completed'
}

// Level type
export interface Level {
  id: string;
  order: number;
  title: string;
  description: string;
  isLocked: boolean;
  isPremium: boolean;
  skillsFocus: SkillType[];
  videos: Video[];
  tests: Test[];
  artifacts: LevelArtifact[];
}

// Skill types that can be developed in levels
export enum SkillType {
  PERSONAL_SKILLS = 'personalSkills',
  MANAGEMENT = 'management',
  NETWORKING = 'networking',
  CLIENT_WORK = 'clientWork',
  FINANCE = 'finance',
  LEGAL = 'legal'
} 