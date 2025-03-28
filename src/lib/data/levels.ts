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