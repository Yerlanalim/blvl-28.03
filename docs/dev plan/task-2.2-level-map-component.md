# Task 2.2: Build Level Map Component

## Task Details

```
Task: Implement the gamified level map visualization
Reference: Level Progression System and UI Reference (Image 1) in project description
Context: The level map is the main navigation interface for the application
Current Files:
- /types/Level.ts (Level type definitions)
- /types/Progress.ts (Progress tracking types)
- /components/layout/MainLayout.tsx (Main layout)
- /app/(main)/map/page.tsx (Map page placeholder)
Previous Decision: Follow the UI design in Image 1 with levels connected by lines
```

## Context Recovery Steps

1. Review the project description document, particularly the Level Progression System and UI Reference sections:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Level and Progress type definitions:
   ```bash
   cat types/Level.ts
   cat types/Progress.ts
   ```

4. Review the map page placeholder:
   ```bash
   cat app/\(main\)/map/page.tsx
   ```

## Implementation Steps

```
1. Create `/lib/data/levels.ts` with mock level data:

```typescript
/**
 * @file levels.ts
 * @description Mock data for levels
 */

import { Level, LevelStatus, SkillType } from '@/types';

/**
 * Mock level data for development purposes
 */
export const mockLevels: Level[] = [
  {
    id: 'level-1',
    order: 1,
    title: 'Постановка целей',
    description: 'Научитесь правильно ставить бизнес-цели и отслеживать их достижение',
    isLocked: false,
    isPremium: false,
    skillsFocus: [SkillType.MANAGEMENT, SkillType.PERSONAL_SKILLS],
    videos: [
      {
        id: 'video-1-1',
        title: 'Введение в постановку целей',
        description: 'Почему важно правильно ставить цели',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 180,
        order: 1
      },
      {
        id: 'video-1-2',
        title: 'SMART-подход к целям',
        description: 'Как сделать цели измеримыми и достижимыми',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 240,
        order: 2
      },
      {
        id: 'video-1-3',
        title: 'Отслеживание прогресса',
        description: 'Инструменты для мониторинга достижения целей',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 210,
        order: 3
      }
    ],
    tests: [
      {
        id: 'test-1-1',
        afterVideoId: 'video-1-2',
        questions: [
          {
            id: 'q-1-1-1',
            text: 'Что означает буква S в аббревиатуре SMART?',
            options: ['Stretching', 'Specific', 'Simple', 'Strategic'],
            correctAnswer: 1
          },
          {
            id: 'q-1-1-2',
            text: 'Какая характеристика НЕ относится к SMART-целям?',
            options: ['Measurable', 'Achievable', 'Relevant', 'Theoretical'],
            correctAnswer: 3
          }
        ]
      }
    ],
    artifacts: [
      {
        id: 'artifact-1-1',
        title: 'Шаблон SMART-целей',
        description: 'Excel-таблица для планирования и отслеживания SMART-целей',
        fileUrl: '/artifacts/smart-goals-template.xlsx',
        fileType: 'spreadsheet'
      }
    ]
  },
  {
    id: 'level-2',
    order: 2,
    title: 'Экспресс стресс-менеджмент',
    description: 'Методики управления стрессом в условиях высокой нагрузки',
    isLocked: true,
    isPremium: false,
    skillsFocus: [SkillType.PERSONAL_SKILLS],
    videos: [
      {
        id: 'video-2-1',
        title: 'Признаки стресса у руководителя',
        description: 'Как распознать начинающийся стресс',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 180,
        order: 1
      },
      {
        id: 'video-2-2',
        title: 'Быстрые техники релаксации',
        description: 'Методики, которые можно применить за 5 минут',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 240,
        order: 2
      },
      {
        id: 'video-2-3',
        title: 'Делегирование как метод снижения нагрузки',
        description: 'Как правильно распределять задачи',
        youtubeId: 'dQw4w9WgXcQ',
        duration: 210,
        order: 3
      }
    ],
    tests: [],
    artifacts: [
      {
        id: 'artifact-2-1',
        title: 'Чек-лист управления стрессом',
        description: 'PDF с набором техник для ежедневного применения',
        fileUrl: '/artifacts/stress-management-checklist.pdf',
        fileType: 'pdf'
      }
    ]
  },
  {
    id: 'level-3',
    order: 3,
    title: 'Управление приоритетами',
    description: 'Методики определения важных задач и управления временем',
    isLocked: true,
    isPremium: false,
    skillsFocus: [SkillType.MANAGEMENT, SkillType.PERSONAL_SKILLS],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-4',
    order: 4,
    title: 'Учет доходов и расходов',
    description: 'Базовый финансовый учет для предпринимателя',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.FINANCE],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-5',
    order: 5,
    title: 'Создание УТП',
    description: 'Создание уникального торгового предложения',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.CLIENT_WORK],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-6',
    order: 6,
    title: 'Elevator Pitch',
    description: 'Как кратко и убедительно представить свой продукт',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.NETWORKING, SkillType.CLIENT_WORK],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-7',
    order: 7,
    title: 'SMART планирование',
    description: 'Эффективное планирование с использованием SMART-критериев',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.MANAGEMENT],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-8',
    order: 8,
    title: 'Блиц-опрос клиентов',
    description: 'Техники быстрого сбора обратной связи от клиентов',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.CLIENT_WORK],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-9',
    order: 9,
    title: 'Юридический чек-лист',
    description: 'Основные юридические аспекты ведения бизнеса',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.LEGAL],
    videos: [],
    tests: [],
    artifacts: []
  },
  {
    id: 'level-10',
    order: 10,
    title: 'Карта ближайших действий',
    description: 'Планирование ключевых действий для развития бизнеса',
    isLocked: true,
    isPremium: true,
    skillsFocus: [SkillType.MANAGEMENT, SkillType.PERSONAL_SKILLS],
    videos: [],
    tests: [],
    artifacts: []
  }
];

/**
 * Get all levels ordered by their order property
 */
export function getLevels() {
  return [...mockLevels].sort((a, b) => a.order - b.order);
}

/**
 * Get level by ID
 */
export function getLevelById(id: string) {
  return mockLevels.find(level => level.id === id) || null;
}

/**
 * Get level status based on user progress
 */
export function getLevelStatus(levelId: string, completedLevels: string[], currentLevel: string): LevelStatus {
  if (completedLevels.includes(levelId)) {
    return LevelStatus.COMPLETED;
  }
  
  if (currentLevel === levelId) {
    return LevelStatus.AVAILABLE;
  }
  
  // Get the level
  const level = getLevelById(levelId);
  if (!level) return LevelStatus.LOCKED;
  
  // First level is always available
  if (level.order === 1) {
    return LevelStatus.AVAILABLE;
  }
  
  // Check if previous level is completed
  const previousLevel = mockLevels.find(l => l.order === level.order - 1);
  if (previousLevel && completedLevels.includes(previousLevel.id)) {
    return LevelStatus.AVAILABLE;
  }
  
  return LevelStatus.LOCKED;
}
```

2. Create `/lib/data/user-progress.ts` with mock progress data:

```typescript
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
```

3. Create `/hooks/useLevels.ts` to manage level data:

```typescript
/**
 * @file useLevels.ts
 * @description Hook for accessing level data and user progress
 * @dependencies lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { Level, LevelStatus, UserProgress } from '@/types';
import { getLevels, getLevelById, getLevelStatus } from '@/lib/data/levels';
import { getUserProgress, isLevelCompleted, isLevelAvailable } from '@/lib/data/user-progress';
import { useAuth } from './useAuth';

/**
 * Hook for accessing and managing level data
 */
export function useLevels() {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch levels and user progress
  useEffect(() => {
    try {
      // Get all levels
      const allLevels = getLevels();
      setLevels(allLevels);
      
      // Get user progress if user is authenticated
      if (user) {
        const progress = getUserProgress(user.id);
        setUserProgress(progress);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching levels:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch levels'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Get status for a specific level
   */
  const getLevelStatusForUser = useCallback((levelId: string): LevelStatus => {
    if (!userProgress) return LevelStatus.LOCKED;
    
    return getLevelStatus(
      levelId, 
      userProgress.completedLevels, 
      userProgress.currentLevel
    );
  }, [userProgress]);

  /**
   * Check if a level is completed
   */
  const isCompleted = useCallback((levelId: string): boolean => {
    if (!userProgress) return false;
    return isLevelCompleted(levelId, userProgress);
  }, [userProgress]);

  /**
   * Check if a level is available
   */
  const isAvailable = useCallback((levelId: string): boolean => {
    if (!userProgress) return levelId === 'level-1'; // First level is always available
    return isLevelAvailable(levelId, userProgress);
  }, [userProgress]);

  /**
   * Get all levels with their status
   */
  const getLevelsWithStatus = useCallback((): (Level & { status: LevelStatus })[] => {
    return levels.map(level => ({
      ...level,
      status: getLevelStatusForUser(level.id)
    }));
  }, [levels, getLevelStatusForUser]);

  return {
    levels,
    userProgress,
    loading,
    error,
    getLevelStatusForUser,
    isCompleted,
    isAvailable,
    getLevelsWithStatus
  };
}
```

4. Create `/components/features/level-map/LevelCard.tsx`:

```typescript
/**
 * @file LevelCard.tsx
 * @description Card component for displaying a level in the map
 */

import React from 'react';
import Link from 'next/link';
import { LockIcon, CheckIcon } from 'lucide-react';
import { Level, LevelStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface LevelCardProps {
  level: Level;
  status: LevelStatus;
}

/**
 * LevelCard component
 * 
 * Displays a level card with appropriate styling based on status
 */
export function LevelCard({ level, status }: LevelCardProps) {
  // Determine card styling based on status
  const cardStyles = {
    [LevelStatus.COMPLETED]: 'bg-teal-500 text-white hover:bg-teal-600',
    [LevelStatus.AVAILABLE]: 'bg-white hover:bg-gray-50',
    [LevelStatus.LOCKED]: 'bg-gray-100 text-gray-500 cursor-not-allowed'
  };

  // Status icon
  const StatusIcon = () => {
    if (status === LevelStatus.COMPLETED) {
      return <CheckIcon className="w-5 h-5" />;
    }
    
    if (status === LevelStatus.LOCKED) {
      return <LockIcon className="w-5 h-5" />;
    }
    
    return null;
  };

  // Render card with appropriate link
  const cardContent = (
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Level {level.order}</h3>
          <p className={`text-sm ${status === LevelStatus.LOCKED ? 'text-gray-400' : ''}`}>
            {level.title}
          </p>
        </div>
        <StatusIcon />
      </div>
    </CardContent>
  );

  // Wrap with Link if not locked
  if (status === LevelStatus.LOCKED) {
    return (
      <Card className={`w-full ${cardStyles[status]}`}>
        {cardContent}
      </Card>
    );
  }

  return (
    <Link href={`/level/${level.id}`}>
      <Card className={`w-full ${cardStyles[status]}`}>
        {cardContent}
      </Card>
    </Link>
  );
}
```

5. Create `/components/features/level-map/LevelConnection.tsx`:

```typescript
/**
 * @file LevelConnection.tsx
 * @description Component for displaying connections between levels
 */

import React from 'react';
import { LevelStatus } from '@/types';

interface LevelConnectionProps {
  direction: 'horizontal' | 'vertical' | 'corner-right' | 'corner-left';
  status: LevelStatus;
}

/**
 * LevelConnection component
 * 
 * Displays a connection line between level cards
 */
export function LevelConnection({ direction, status }: LevelConnectionProps) {
  // Determine line styling based on status
  const lineColor = status === LevelStatus.COMPLETED 
    ? 'bg-teal-500' 
    : 'bg-gray-300';
  
  // Horizontal line
  if (direction === 'horizontal') {
    return (
      <div className="flex items-center justify-center w-full h-4">
        <div className={`h-1 w-full ${lineColor}`}></div>
      </div>
    );
  }

  // Vertical line
  if (direction === 'vertical') {
    return (
      <div className="flex items-center justify-center w-4 h-full">
        <div className={`w-1 h-full ${lineColor}`}></div>
      </div>
    );
  }

  // Corner right (┌)
  if (direction === 'corner-right') {
    return (
      <div className="relative w-full h-full">
        <div className={`absolute right-1/2 top-0 w-1 h-1/2 ${lineColor}`}></div>
        <div className={`absolute right-1/2 top-1/2 w-1/2 h-1 ${lineColor}`}></div>
      </div>
    );
  }

  // Corner left (┐)
  if (direction === 'corner-left') {
    return (
      <div className="relative w-full h-full">
        <div className={`absolute left-1/2 top-0 w-1 h-1/2 ${lineColor}`}></div>
        <div className={`absolute left-0 top-1/2 w-1/2 h-1 ${lineColor}`}></div>
      </div>
    );
  }

  return null;
}
```

6. Create `/components/features/level-map/LevelMap.tsx`:

```typescript
/**
 * @file LevelMap.tsx
 * @description Main level map component
 * @dependencies hooks/useLevels, components/features/level-map/*
 */

'use client';

import React from 'react';
import { useLevels } from '@/hooks/useLevels';
import { LevelCard } from './LevelCard';
import { LevelConnection } from './LevelConnection';
import { LevelStatus } from '@/types';

/**
 * LevelMap component
 * 
 * Displays the gamified level map with all levels and connections
 */
export function LevelMap() {
  const { getLevelsWithStatus, loading, error } = useLevels();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading levels: {error.message}
      </div>
    );
  }

  // Get levels with status
  const levels = getLevelsWithStatus();

  // Helper to get connection status
  const getConnectionStatus = (levelIndex: number): LevelStatus => {
    if (levelIndex <= 0) return LevelStatus.AVAILABLE;
    
    const previousLevel = levels[levelIndex - 1];
    if (previousLevel.status === LevelStatus.COMPLETED) {
      return LevelStatus.COMPLETED;
    }
    
    return LevelStatus.LOCKED;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Карта Уровней</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Row 1: Levels 1-3 */}
        <div className="col-span-1">
          <LevelCard level={levels[0]} status={levels[0].status} />
        </div>
        <div className="col-span-1 flex items-center">
          <LevelConnection direction="horizontal" status={getConnectionStatus(1)} />
        </div>
        <div className="col-span-1">
          <LevelCard level={levels[1]} status={levels[1].status} />
        </div>
        
        {/* Connector to Level 3 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 2: Level 3 */}
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[2]} status={levels[2].status} />
        </div>
        
        {/* Connector to Level 4 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-1/2 bg-gray-300"></div>
          <div className="absolute left-1/3 top-1/2 w-1/3 h-1 bg-gray-300"></div>
        </div>
        
        {/* Row 3: Level 4 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[3]} status={levels[3].status} />
        </div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 5 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 4: Level 5 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[4]} status={levels[4].status} />
        </div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 6 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/3 top-0 w-1 h-1/2 bg-gray-300"></div>
          <div className="absolute left-0 top-1/2 w-1/3 h-1 bg-gray-300"></div>
        </div>
        
        {/* Row 5: Level 6 */}
        <div className="col-span-1">
          <LevelCard level={levels[5]} status={levels[5].status} />
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        
        {/* Connector to Level 7 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/6 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 6: Level 7 */}
        <div className="col-span-1">
          <LevelCard level={levels[6]} status={levels[6].status} />
        </div>
        <div className="col-span-1 flex items-center">
          <LevelConnection direction="horizontal" status={getConnectionStatus(7)} />
        </div>
        <div className="col-span-1">
          <LevelCard level={levels[7]} status={levels[7].status} />
        </div>
        
        {/* Connector to Level 9 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute right-1/3 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 7: Level 9 */}
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[8]} status={levels[8].status} />
        </div>
        
        {/* Connector to Level 10 */}
        <div className="col-span-3 h-12 relative">
          <div className="absolute left-1/2 right-1/2 top-0 w-1 h-full bg-gray-300"></div>
        </div>
        
        {/* Row 8: Level 10 */}
        <div className="col-span-1"></div>
        <div className="col-span-1">
          <LevelCard level={levels[9]} status={levels[9].status} />
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
}
```

7. Update `/app/(main)/map/page.tsx` to use the LevelMap component:

```typescript
/**
 * @file page.tsx
 * @description Map page with level map component
 * @dependencies components/features/level-map/LevelMap
 */

import { LevelMap } from '@/components/features/level-map/LevelMap';

export default function MapPage() {
  return <LevelMap />;
}
```

## Expected Output

```
- Level map feature files:
  - /lib/data/levels.ts (Mock level data)
  - /lib/data/user-progress.ts (Mock user progress data)
  - /hooks/useLevels.ts (Hook for level data management)
  - /components/features/level-map/LevelCard.tsx (Individual level card)
  - /components/features/level-map/LevelConnection.tsx (Connection between levels)
  - /components/features/level-map/LevelMap.tsx (Main level map component)
  - /app/(main)/map/page.tsx (Updated map page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Level map component and level progression system

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout
   - Task 2.2: Build Level Map Component

   ## Current Issues
   - None

   ## Next Up
   - Task 2.3: Implement Profile Page

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/level-map.md` with a description of the level map system:
   ```markdown
   # Level Map System

   ## Overview
   This document describes the level map system, which is the main navigation interface for the BizLevel application.

   ## Components

   ### 1. LevelMap
   - Main component that displays the gamified learning path
   - Shows all levels with their status (locked, available, completed)
   - Creates a visual path with connections between levels

   ### 2. LevelCard
   - Individual card for each level
   - Shows level number, title, and status
   - Changes appearance based on status:
     - Completed: Green with checkmark
     - Available: White with title
     - Locked: Gray with lock icon

   ### 3. LevelConnection
   - Visual connection between level cards
   - Shows progression path between levels
   - Changes appearance based on completion status

   ## Data Management

   ### Level Data
   - Mock data in `/lib/data/levels.ts` for development
   - Will be replaced with Firestore data in production
   - Contains level information, videos, tests, and artifacts

   ### Progress Tracking
   - Mock progress data in `/lib/data/user-progress.ts`
   - Tracks completed levels, current level, and skill progress
   - Used to determine level status and unlock logic

   ### useLevels Hook
   - Custom hook for accessing level data and progress
   - Provides helpers for checking level status
   - Combines level data with user progress

   ## Level Progression Logic

   ### Unlocking Mechanism
   - Level 1 is always available to all users
   - Next level unlocks when the previous level is completed
   - Level completion requires:
     - Watching all videos
     - Completing all tests
     - Downloading artifacts
     - Clicking "Complete Level" button

   ### Status Indicators
   - Completed: User has finished all requirements
   - Available: User can access the level
   - Locked: User needs to complete previous levels

   ## Visual Design
   - Gamified path layout similar to learning apps like Duolingo
   - Connected levels showing progression
   - Clear visual indicators for level status
   - Responsive design for different screen sizes

   ## Implementation Details
   - React components with TypeScript
   - Tailwind CSS for styling
   - useLevels hook for data management
   - Card components from shadcn/ui
   ```

3. Create a snapshot document at `/docs/snapshots/level-map.md`:
   ```markdown
   # Level Map Component Snapshot

   ## Purpose
   Gamified visualization of the learning path with level progression

   ## Key Files
   - `/lib/data/levels.ts` - Mock level data
   - `/lib/data/user-progress.ts` - Mock user progress data
   - `/hooks/useLevels.ts` - Hook for level data management
   - `/components/features/level-map/LevelCard.tsx` - Individual level card
   - `/components/features/level-map/LevelConnection.tsx` - Connection between levels
   - `/components/features/level-map/LevelMap.tsx` - Main level map component
   - `/app/(main)/map/page.tsx` - Map page using the level map component

   ## State Management
   - Level data is managed by the useLevels hook
   - User progress determines level status (locked, available, completed)
   - Visual state changes based on level status

   ## Data Flow
   1. useLevels hook fetches level data and user progress
   2. Level status is calculated based on user progress
   3. LevelMap component renders levels with appropriate status
   4. LevelCard components show individual levels with status indicators
   5. LevelConnection components create the visual path between levels

   ## Key Decisions
   - Using a grid layout for level positioning
   - Different card styles for different level statuses
   - Mock data for development with easy transition to Firestore
   - Gamified path with visual connections between levels

   ## Usage Example
   ```tsx
   import { LevelMap } from '@/components/features/level-map/LevelMap';

   export default function MapPage() {
     return <LevelMap />;
   }
   ```

   ## Known Issues
   - Current implementation uses fixed positioning for connections
   - May need adjustments for more flexible layouts in the future
   ```

## Testing Instructions

1. Test the level map component:
   - Run the development server
   - Navigate to the map page (`/map`)
   - Verify that the level map appears with all 10 levels
   - Check that the first level is available and the rest are locked
   - Verify that the visual connections between levels appear correctly

2. Test level status display:
   - Modify the mock user progress data to mark more levels as completed
   - Verify that completed levels show as green with checkmarks
   - Verify that available levels show as white and are clickable
   - Verify that locked levels show as gray with lock icons

3. Test responsive design:
   - Check the level map on different screen sizes
   - Verify that the layout adjusts appropriately on mobile devices

4. Test navigation:
   - Click on an available level card
   - Verify that it navigates to the level detail page
   - Verify that clicking on locked levels doesn't navigate away
