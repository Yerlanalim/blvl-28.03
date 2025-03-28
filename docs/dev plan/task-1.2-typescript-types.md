# Task 1.2: Create TypeScript Type Definitions

## Task Details

```
Task: Define core TypeScript types for the application
Reference: Database Schema section in project description
Context: We need strong type definitions before building components and services
Current Files: Basic project structure from Task 1.1
Previous Decision: Types should be modular and focused on specific domains
```

## Context Recovery Steps

1. Review the project description document, particularly the Database Schema section:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the project structure:
   ```bash
   find . -type f -not -path "*/node_modules/*" -not -path "*/\.git/*" -not -path "*/\.next/*" | sort
   ```

## Implementation Steps

```
1. Create `/types/User.ts` with user-related types:

```typescript
/**
 * @file User.ts
 * @description Type definitions for user data, authentication, and business information
 */

// Base user type from Firebase Auth
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Business information type
export interface BusinessInfo {
  description: string;
  employees: number;
  revenue: string;
  goals: string[];
}

// Application user with additional fields
export interface User extends Omit<FirebaseUser, 'uid'> {
  id: string; // Same as uid, just renamed for consistency
  businessInfo?: BusinessInfo;
  createdAt: Date | string;
  lastLogin: Date | string;
  role: 'user' | 'admin';
}

// User creation data
export type UserCreationData = Omit<User, 'id' | 'createdAt' | 'lastLogin'> & {
  password: string;
};

// Authentication form data
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData extends LoginFormData {
  displayName: string;
  businessInfo?: BusinessInfo;
}

export interface ResetPasswordFormData {
  email: string;
}
```

2. Create `/types/Level.ts` with level-related types:

```typescript
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
```

3. Create `/types/Progress.ts` with progress tracking types:

```typescript
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
```

4. Create `/types/Artifact.ts` with artifact-related types:

```typescript
/**
 * @file Artifact.ts
 * @description Type definitions for downloadable artifacts
 */

// Artifact file types
export enum ArtifactFileType {
  PDF = 'pdf',
  DOC = 'doc',
  SPREADSHEET = 'spreadsheet'
}

// Artifact metadata
export interface Artifact {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: ArtifactFileType;
  levelId: string;
  downloadCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User artifact interaction
export interface ArtifactInteraction {
  userId: string;
  artifactId: string;
  downloaded: boolean;
  downloadedAt?: Date | string;
  feedback?: {
    rating: number;
    comment?: string;
  };
}
```

5. Create `/types/Chat.ts` with chat-related types:

```typescript
/**
 * @file Chat.ts
 * @description Type definitions for chat functionality
 */

// Message sender types
export enum MessageSender {
  USER = 'user',
  BOT = 'bot'
}

// Chat message
export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date | string;
  read: boolean;
}

// Chat history
export interface ChatHistory {
  userId: string;
  messages: ChatMessage[];
}

// Message for sending to OpenAI
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Chat context with user progress
export interface ChatContext {
  currentLevel?: string;
  completedLevels?: string[];
  skillProgress?: Record<string, number>;
}
```

6. Create `/types/index.ts` to export all types:

```typescript
/**
 * @file index.ts
 * @description Central export for all type definitions
 */

export * from './User';
export * from './Level';
export * from './Progress';
export * from './Artifact';
export * from './Chat';

// Common types used across the application
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
```

## Expected Output

```
- Complete type definitions in the following files:
  - /types/User.ts
  - /types/Level.ts
  - /types/Progress.ts
  - /types/Artifact.ts
  - /types/Chat.ts
  - /types/index.ts
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Core type definitions and data model

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models

   ## Current Issues
   - None

   ## Next Up
   - Task 1.3: Set up Firebase Configuration

   ## Component Status
   - Authentication: Not Started (Type definitions created)
   - Level Map: Not Started (Type definitions created)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started
   ```

2. Create `/docs/features/data-model.md` with a description of the type system:
   ```markdown
   # Data Model

   ## Overview
   This document describes the core data types used throughout the BizLevel application.

   ## Types Hierarchy
   - User-related types: Authentication, profiles, and business information
   - Level-related types: Learning content, videos, tests, and artifacts
   - Progress-related types: User progress, skill development, and achievements
   - Artifact-related types: Downloadable resources and interaction tracking
   - Chat-related types: Chat messages, history, and AI interactions

   ## Key Relationships
   - Users have a UserProgress record tracking their journey
   - Levels contain Videos, Tests, and Artifacts
   - UserProgress tracks completed Levels, Videos, Tests, and Artifacts
   - Skill development is calculated based on Level completion
   
   ## Type Definitions
   Detailed type definitions can be found in the `/types` directory.
   ```

## Testing Instructions

1. Verify the type files are created correctly

2. Check for any TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

3. Ensure all types are exported from the index.ts file
