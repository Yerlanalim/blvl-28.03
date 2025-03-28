# Task 4.2: Implement Skill Progress Calculation

## Task Details

```
Task: Create system for calculating skill progress
Reference: Database Schema (userProgress) and UI Reference (Image 3) in project description
Context: Each level contributes to different skill categories
Current Files:
- /types/Progress.ts (Progress tracking types)
- /lib/services/progress-service.ts (Progress service)
- /hooks/useProgress.ts (Progress hook)
Previous Decision: Update skill progress based on completed levels and their focus areas
```

## Context Recovery Steps

1. Review the project description document, particularly the User Progress section in Database Schema:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Progress type definitions:
   ```bash
   cat types/Progress.ts
   ```

4. Review the existing progress service and hook:
   ```bash
   cat lib/services/progress-service.ts
   cat hooks/useProgress.ts
   ```

## Implementation Steps

```
1. Create `/lib/services/skill-service.ts` for skill progress calculation:

```typescript
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
```

2. Update `/lib/services/progress-service.ts` to use the skill service for calculations:

```typescript
// At the top of the file, add this import:
import { calculateSkillProgress } from './skill-service';

// Replace the completeLevel function with this enhanced version:

/**
 * Complete level
 * 
 * Updates the user's progress to indicate a level has been completed
 * and updates skill progress based on the level's focus areas
 */
export async function completeLevel(
  userId: string, 
  levelId: string,
  level: Level
): Promise<void> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return;
    
    // Check if level is already completed
    if (progress.completedLevels.includes(levelId)) {
      return; // Already completed, no need to update
    }
    
    // Determine next level
    const currentLevelNumber = parseInt(levelId.split('-')[1]);
    const nextLevelId = `level-${currentLevelNumber + 1}`;
    
    // Update completed levels
    const updatedCompletedLevels = [...progress.completedLevels, levelId];
    
    // Calculate skill progress from all completed levels
    const updatedSkillProgress = calculateSkillProgress(updatedCompletedLevels);
    
    // Update progress
    const updatedProgress = {
      ...progress,
      completedLevels: updatedCompletedLevels,
      currentLevel: nextLevelId,
      skillProgress: updatedSkillProgress,
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // await updateDoc(doc(db, 'userProgress', userId), {
    //   completedLevels: arrayUnion(levelId),
    //   currentLevel: nextLevelId,
    //   skillProgress: updatedSkillProgress,
    //   lastUpdated: serverTimestamp()
    // });
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // Check and award badges (implemented in a separate function)
    await checkAndAwardBadges(userId);
  } catch (error) {
    console.error('Error completing level:', error);
    throw error;
  }
}
```

3. Update `/hooks/useProgress.ts` to expose skill progress information:

```typescript
// At the top of the file, add this import:
import { 
  getSkillsInfo, 
  getSkillInfo, 
  formatSkillsProgress, 
  getDominantSkills,
  getSkillRecommendations,
  SkillInfo
} from '@/lib/services/skill-service';

// Add these functions inside the hook's return object:

/**
 * Get formatted skill progress information
 */
const getFormattedSkillProgress = useCallback((): Array<SkillInfo & { progress: number }> => {
  if (!progress) return [];
  return formatSkillsProgress(progress.skillProgress);
}, [progress]);

/**
 * Get top skills by progress
 */
const getTopSkills = useCallback((count: number = 2): Array<SkillInfo & { progress: number }> => {
  if (!progress) return [];
  const formattedSkills = formatSkillsProgress(progress.skillProgress);
  return formattedSkills
    .sort((a, b) => b.progress - a.progress)
    .slice(0, count);
}, [progress]);

/**
 * Get skill recommendations for improvement
 */
const getSkillRecommendationsForUser = useCallback((): Array<SkillInfo & { recommendedLevels: any[] }> => {
  if (!progress) return [];
  return getSkillRecommendations(
    progress.skillProgress, 
    progress.completedLevels
  );
}, [progress]);

// Add these functions to the hook's return object
return {
  // ...existing returns
  getFormattedSkillProgress,
  getTopSkills,
  getSkillRecommendationsForUser,
  // Make the skill info functions available
  getSkillsInfo,
  getSkillInfo
};
```

4. Create `/components/features/profile/SkillProgressSection.tsx` for a more detailed skill visualization:

```typescript
/**
 * @file SkillProgressSection.tsx
 * @description Enhanced component for displaying skill progress
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillInfo } from '@/lib/services/skill-service';

interface SkillProgressSectionProps {
  skills: Array<SkillInfo & { progress: number }>;
}

/**
 * SkillProgressSection component
 * 
 * Displays skill progress with informative details
 */
export function SkillProgressSection({ skills }: SkillProgressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Навыки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.type} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{skill.displayName}</h3>
                <p className="text-sm text-gray-500">{skill.description}</p>
              </div>
              <span className="text-sm font-medium">{skill.progress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full" 
                style={{ 
                  width: `${skill.progress}%`,
                  backgroundColor: skill.color || '#10B981'
                }}
              ></div>
            </div>
            
            {/* Progress dots (alternative visualization) */}
            <div className="flex space-x-1 pt-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-full ${
                    index < Math.ceil(skill.progress / 10) 
                      ? 'bg-teal-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

5. Create `/components/features/profile/SkillRecommendations.tsx`:

```typescript
/**
 * @file SkillRecommendations.tsx
 * @description Component for displaying skill improvement recommendations
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkillInfo } from '@/lib/services/skill-service';
import { Level } from '@/types';
import { TrendingUp } from 'lucide-react';

interface SkillRecommendationsProps {
  recommendations: Array<SkillInfo & { recommendedLevels: Level[] }>;
}

/**
 * SkillRecommendations component
 * 
 * Displays recommended levels for improving weaker skills
 */
export function SkillRecommendations({ recommendations }: SkillRecommendationsProps) {
  // If no recommendations, don't render
  if (!recommendations.length) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Рекомендации по развитию навыков
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((recommendation) => (
          <div key={recommendation.type} className="space-y-3">
            <div>
              <h3 className="font-medium">{recommendation.displayName}</h3>
              <p className="text-sm text-gray-500">
                Текущий прогресс: {recommendation.progress}%
              </p>
            </div>
            
            {recommendation.recommendedLevels.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm">Рекомендуемые уровни:</p>
                <div className="space-y-2">
                  {recommendation.recommendedLevels.map((level) => (
                    <div key={level.id} className="border rounded-lg p-3">
                      <h4 className="font-medium">Уровень {level.order}: {level.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {level.description}
                      </p>
                      <Link href={`/level/${level.id}`}>
                        <Button variant="outline" size="sm">
                          Перейти к уровню
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">
                Все уровни для этого навыка уже пройдены. Отличная работа!
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

6. Update `/app/(main)/profile/page.tsx` to use the new skill components:

```typescript
// Update the imports section to include:
import { useProgress } from '@/hooks/useProgress';
import { SkillProgressSection } from '@/components/features/profile/SkillProgressSection';
import { SkillRecommendations } from '@/components/features/profile/SkillRecommendations';

// Replace the existing useProfile hook with useProgress:
// Remove the useProfile hook and replace with:
const {
  progress,
  isLoading,
  error,
  getFormattedSkillProgress,
  getSkillRecommendationsForUser
} = useProgress();

// In the rendering section, replace the Skills card with:
{/* Skills */}
<SkillProgressSection
  skills={getFormattedSkillProgress()}
/>

// After the skills section and before the progress overview, add:
{/* Skill Recommendations */}
<SkillRecommendations
  recommendations={getSkillRecommendationsForUser()}
/>
```

7. Update the ProgressDebugPanel component to use the enhanced skill visualization:

```typescript
// In /components/features/admin/ProgressDebugPanel.tsx

// Update the imports to include:
import { SkillProgressSection } from '@/components/features/profile/SkillProgressSection';

// Replace the Skill progress section with:

{/* Skill progress */}
<div>
  <h3 className="text-lg font-medium mb-2">Skill Progress</h3>
  <SkillProgressSection skills={getFormattedSkillProgress()} />
</div>
```

## Expected Output

```
- Skill progress calculation files:
  - /lib/services/skill-service.ts (Skill progress calculation service)
  - /components/features/profile/SkillProgressSection.tsx (Enhanced skill visualization)
  - /components/features/profile/SkillRecommendations.tsx (Skill recommendations component)
  - Updates to:
    - /lib/services/progress-service.ts
    - /hooks/useProgress.ts
    - /app/(main)/profile/page.tsx
    - /components/features/admin/ProgressDebugPanel.tsx
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Skill progress calculation and visualization

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout
   - Task 2.2: Build Level Map Component
   - Task 2.3: Implement Profile Page
   - Task 2.4: Build Level Detail Page
   - Task 3.1: Implement Artifacts System
   - Task 3.2: Implement Chat Interface
   - Task 3.3: Implement Settings Page
   - Task 3.4: Create FAQ Page
   - Task 4.1: Implement Progress Tracking System
   - Task 4.2: Implement Skill Progress Calculation

   ## Current Issues
   - None

   ## Next Up
   - Task 4.3: Implement Badges and Achievements

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Complete (Account settings, preferences, and notifications)
   - FAQ: Complete (Categorized FAQs with search functionality)
   - Progress Tracking: Complete (Tracking system with skill progress calculation)
   ```

2. Create `/docs/features/skill-progress.md` with a description of the skill progress system:
   ```markdown
   # Skill Progress System

   ## Overview
   This document describes the skill progress system, which calculates, tracks, and visualizes user progress across six core business skill areas, providing personalized recommendations for skill improvement.

   ## Components

   ### 1. Skill Service
   - Calculates skill progress based on completed levels
   - Provides skill definitions with display names and descriptions
   - Identifies dominant skills and areas for improvement
   - Generates recommendations for skill development

   ### 2. Progress Service Integration
   - Updates skill progress when levels are completed
   - Stores progress in user profile data
   - Calculates combined progress from multiple levels

   ### 3. SkillProgressSection
   - Visual representation of skill progress
   - Displays progress bars with percentage completion
   - Shows skill descriptions and categories
   - Uses color coding for different skill types

   ### 4. SkillRecommendations
   - Suggests levels for improving weaker skills
   - Analyzes current progress to identify skill gaps
   - Provides direct links to recommended content
   - Prioritizes recommendations by skill need

   ## Skill Categories

   ### Personal Skills (Личные навыки и развитие)
   - Self-organization, time management, emotional intelligence
   - Personal development and growth
   - Work-life balance and stress management

   ### Management (Управление и планирование)
   - Strategy and planning
   - Team and project management
   - Decision-making and leadership

   ### Networking (Нетворкинг и связи)
   - Business connections and relationships
   - Communication skills
   - Networking strategies

   ### Client Work (Работа с клиентами и продажи)
   - Client acquisition and retention
   - Sales strategies
   - Customer service and management

   ### Finance (Финансовое управление)
   - Budgeting and financial planning
   - Financial analysis and reporting
   - Cash flow management

   ### Legal (Бухгалтерские и юр-е вопросы)
   - Legal foundations for business
   - Tax regulations and compliance
   - Documentation and record-keeping

   ## Calculation Logic

   ### Progress Calculation
   - Each completed level contributes points to associated skills
   - Standard increment: 10 points per level per skill
   - Maximum skill level: 100 points (capped)
   - Calculation is performed whenever a level is completed

   ### Recommendations Algorithm
   1. Identify skills with lowest progress values
   2. Find uncompleted levels that focus on those skills
   3. Sort by level order for logical progression
   4. Present top recommendations for each skill area

   ## Implementation Details
   - React components for visualization
   - Service-based calculation logic separate from UI
   - Integration with progress tracking system
   - Data persistence in user progress record
   ```

3. Create a snapshot document at `/docs/snapshots/skill-progress.md`:
   ```markdown
   # Skill Progress System Snapshot

   ## Purpose
   Calculate, visualize, and provide recommendations for user's business skill development

   ## Key Files
   - `/lib/services/skill-service.ts` - Skill calculation service
   - `/components/features/profile/SkillProgressSection.tsx` - Skill visualization
   - `/components/features/profile/SkillRecommendations.tsx` - Recommendations component
   - Modified files:
     - `/lib/services/progress-service.ts` - Integration with progress tracking
     - `/hooks/useProgress.ts` - Exposing skill calculations to components
     - `/app/(main)/profile/page.tsx` - Updated profile page with new components

   ## State Management
   - Skill definitions and metadata stored in service
   - Skill progress calculated based on completed levels
   - Progress values stored in user progress record
   - React hooks provide formatted skill data to components

   ## Data Flow
   1. Level completion triggers skill progress recalculation
   2. Progress service stores updated skill values
   3. useProgress hook provides formatted skill data
   4. Profile components visualize skill progress
   5. Recommendation engine suggests levels for improvement

   ## Key Decisions
   - Six core skill categories covering key business competencies
   - Color-coded skill visualization for clarity
   - Multi-format visualization (progress bars and dots)
   - Points-based progression system (10 points per level)
   - Personalized recommendations based on skill gaps

   ## Usage Example
   ```tsx
   import { useProgress } from '@/hooks/useProgress';
   import { SkillProgressSection } from '@/components/features/profile/SkillProgressSection';

   function SkillsDisplay() {
     const { getFormattedSkillProgress } = useProgress();
     
     return (
       <SkillProgressSection skills={getFormattedSkillProgress()} />
     );
   }
   ```

   ## Known Issues
   - None at this time
   ```

## Testing Instructions

1. Test the skill progress calculation:
   - Run the development server
   - Navigate to the debug page (`/debug`)
   - Reset progress to start fresh
   - Navigate to the level page (`/level/level-1`)
   - Complete the level requirements and mark as completed
   - Verify that the skill progress is updated in the debug panel

2. Test skill visualization:
   - Navigate to the profile page (`/profile`)
   - Verify that the skill progress bars show the correct progress
   - Check that the progress dots visualization works
   - Verify that skill descriptions are displayed correctly

3. Test skill recommendations:
   - Complete some levels to create diverse skill progress
   - Navigate to the profile page
   - Verify that recommendations are shown for skills with lower progress
   - Check that the recommended levels are appropriate
   - Test navigation to recommended levels

4. Test edge cases:
   - Test with no completed levels (all skills at 0%)
   - Test with all levels completed (skills should show maximum progress)
   - Verify that UI handles 0% and 100% progress correctly

5. Verify color coding:
   - Check that each skill has a distinct color
   - Verify that the colors match between progress bars and descriptions
   - Ensure good contrast for accessibility
