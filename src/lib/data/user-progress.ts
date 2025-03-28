/**
 * @file user-progress.ts
 * @description Mock data for user progress
 */

import { UserProgress, SkillType, VideoProgress, TestProgress, Badge } from '@/types';

/**
 * Mock user progress data for development purposes
 */
export const mockUserProgress: UserProgress = {
  userId: 'user-1',
  completedLevels: ['level-1'],
  currentLevel: 'level-2',
  skillProgress: {
    [SkillType.PERSONAL_SKILLS]: 20,
    [SkillType.MANAGEMENT]: 30,
    [SkillType.NETWORKING]: 10,
    [SkillType.CLIENT_WORK]: 15,
    [SkillType.FINANCE]: 5,
    [SkillType.LEGAL]: 0
  },
  badges: [
    {
      id: 'badge-1',
      name: 'Star Performer',
      description: 'Completed the first level with perfect test scores',
      achieved: true,
      achievedAt: new Date().toISOString()
    },
    {
      id: 'badge-2',
      name: 'Silver Medalist',
      description: 'Completed 5 levels',
      achieved: false
    }
  ],
  downloadedArtifacts: ['artifact-1-1'],
  watchedVideos: ['video-1-1', 'video-1-2', 'video-1-3'],
  completedTests: ['test-1-1'],
  lastUpdated: new Date().toISOString()
};

/**
 * Mock video progress data
 */
export const mockVideoProgress: VideoProgress[] = [
  {
    videoId: 'video-1-1',
    watched: true,
    position: 180,
    completedAt: new Date().toISOString()
  },
  {
    videoId: 'video-1-2',
    watched: true,
    position: 240,
    completedAt: new Date().toISOString()
  },
  {
    videoId: 'video-1-3',
    watched: true,
    position: 210,
    completedAt: new Date().toISOString()
  }
];

/**
 * Mock test progress data
 */
export const mockTestProgress: TestProgress[] = [
  {
    testId: 'test-1-1',
    completed: true,
    score: 100,
    answers: [
      {
        questionId: 'q-1-1-1',
        answeredOption: 1,
        isCorrect: true
      },
      {
        questionId: 'q-1-1-2',
        answeredOption: 3,
        isCorrect: true
      }
    ],
    completedAt: new Date().toISOString()
  }
];

/**
 * Get user progress
 */
export function getUserProgress(userId: string): UserProgress {
  // In a real app, we'd fetch from Firestore
  return { ...mockUserProgress, userId };
}

/**
 * Check if a level is completed
 */
export function isLevelCompleted(levelId: string, progress: UserProgress): boolean {
  return progress.completedLevels.includes(levelId);
}

/**
 * Check if a level is available
 */
export function isLevelAvailable(levelId: string, progress: UserProgress): boolean {
  return progress.currentLevel === levelId || progress.completedLevels.includes(levelId);
}

/**
 * Check if a video is watched
 */
export function isVideoWatched(videoId: string, progress: UserProgress): boolean {
  return progress.watchedVideos.includes(videoId);
}

/**
 * Check if a test is completed
 */
export function isTestCompleted(testId: string, progress: UserProgress): boolean {
  return progress.completedTests.includes(testId);
}

/**
 * Check if an artifact is downloaded
 */
export function isArtifactDownloaded(artifactId: string, progress: UserProgress): boolean {
  return progress.downloadedArtifacts.includes(artifactId);
}

/**
 * Get skill progress percentage
 */
export function getSkillProgressPercentage(skillType: SkillType, progress: UserProgress): number {
  return progress.skillProgress[skillType];
} 