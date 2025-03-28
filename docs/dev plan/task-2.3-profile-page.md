# Task 2.3: Implement Profile Page

## Task Details

```
Task: Create user profile page with progress visualization
Reference: Core Components and UI Reference (Image 3) in project description
Context: Users need to see their progress and skill development
Current Files:
- /types/User.ts (User types)
- /types/Progress.ts (Progress types)
- /hooks/useAuth.ts (Auth hook)
- /lib/data/user-progress.ts (Mock progress data)
- /app/(main)/profile/page.tsx (Profile page placeholder)
Previous Decision: Follow the UI design in Image 3 with skill progress bars and badges
```

## Context Recovery Steps

1. Review the project description document, particularly the Profile Page section in UI Reference:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the User and Progress type definitions:
   ```bash
   cat types/User.ts
   cat types/Progress.ts
   ```

4. Review the mock user progress data:
   ```bash
   cat lib/data/user-progress.ts
   ```

## Implementation Steps

```
1. Create a hook for user profile data at `/hooks/useProfile.ts`:

```typescript
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
```

2. Create `/components/features/profile/SkillProgressBar.tsx`:

```typescript
/**
 * @file SkillProgressBar.tsx
 * @description Component for displaying skill progress as a bar with dots
 */

import React from 'react';

interface SkillProgressBarProps {
  name: string;
  progress: number;
  maxDots?: number;
}

/**
 * SkillProgressBar component
 * 
 * Displays skill progress as a series of dots
 */
export function SkillProgressBar({ name, progress, maxDots = 10 }: SkillProgressBarProps) {
  // Calculate how many dots should be filled
  const filledDots = Math.round((progress / 100) * maxDots);
  
  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-1">
        <div className="bg-teal-500 text-white text-sm px-4 py-2 rounded-full w-full">
          {name}
        </div>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: maxDots }).map((_, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full ${
              index < filledDots ? 'bg-teal-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

3. Create `/components/features/profile/BadgeDisplay.tsx`:

```typescript
/**
 * @file BadgeDisplay.tsx
 * @description Component for displaying user badges
 */

import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { AwardIcon } from 'lucide-react';

interface BadgeDisplayProps {
  badge: Badge;
}

/**
 * BadgeDisplay component
 * 
 * Displays a user badge with icon and name
 */
export function BadgeDisplay({ badge }: BadgeDisplayProps) {
  return (
    <Card className={`w-full ${badge.achieved ? 'bg-white' : 'bg-gray-100'}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <div className={`mb-2 p-2 rounded-full ${badge.achieved ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'}`}>
          <AwardIcon className="w-8 h-8" />
        </div>
        <h4 className="text-sm font-medium text-center">{badge.name}</h4>
        {!badge.achieved && <p className="text-xs text-gray-500 mt-1">Locked</p>}
      </CardContent>
    </Card>
  );
}
```

4. Create `/components/features/profile/ProfileCard.tsx`:

```typescript
/**
 * @file ProfileCard.tsx
 * @description Component for displaying user profile information
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  user: User;
  businessInfo?: {
    description: string;
    employees: number;
    revenue: string;
    goals: string[];
  };
}

/**
 * ProfileCard component
 * 
 * Displays user profile information and business details
 */
export function ProfileCard({ user, businessInfo }: ProfileCardProps) {
  const hasPartialBusinessInfo = businessInfo && (
    businessInfo.description ||
    businessInfo.employees ||
    businessInfo.revenue ||
    (businessInfo.goals && businessInfo.goals.length > 0)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{user.displayName || 'User'}</span>
          <span className="text-sm text-gray-500 font-normal">Ambitious</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Информация о бизнесе</h3>
          
          {hasPartialBusinessInfo ? (
            <div className="space-y-2">
              {businessInfo?.description && (
                <p className="text-sm">{businessInfo.description}</p>
              )}
              
              <p className="text-sm">
                {[
                  businessInfo?.employees && `${businessInfo.employees} сотрудников`,
                  businessInfo?.revenue && `выручка - ${businessInfo.revenue}`,
                  businessInfo?.goals?.length && `основные цели: ${businessInfo.goals.join(', ')}`
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Информация о бизнесе не заполнена</p>
          )}
          
          <div className="mt-4">
            <Button variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
              Завершить заполнение Бизнес профиля...
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

5. Create `/components/features/profile/ProgressOverview.tsx`:

```typescript
/**
 * @file ProgressOverview.tsx
 * @description Component for displaying overall progress information
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressOverviewProps {
  completedLevels: number;
  totalLevels: number;
  overallProgress: number;
}

/**
 * ProgressOverview component
 * 
 * Displays overall progress with progress bar
 */
export function ProgressOverview({ completedLevels, totalLevels, overallProgress }: ProgressOverviewProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Прогресс</h3>
        
        <Progress value={overallProgress} className="h-3 mb-4" />
        
        <p className="text-center">
          Вы прошли <span className="font-bold">{completedLevels}</span> уровней из{' '}
          <span className="font-bold">{totalLevels}</span> доступных
        </p>
      </CardContent>
    </Card>
  );
}
```

6. Create `/components/ui/progress.tsx`:

```
npx shadcn-ui@latest add progress
```

7. Update `/app/(main)/profile/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description User profile page
 * @dependencies components/features/profile/*
 */

'use client';

import { useProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/features/profile/ProfileCard';
import { SkillProgressBar } from '@/components/features/profile/SkillProgressBar';
import { BadgeDisplay } from '@/components/features/profile/BadgeDisplay';
import { ProgressOverview } from '@/components/features/profile/ProgressOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const {
    user,
    loading,
    error,
    getFormattedSkills,
    getOverallProgress,
    completedLevelsCount,
    badges
  } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading profile data: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Профиль</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const skills = getFormattedSkills();
  const overallProgress = getOverallProgress();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="font-medium">Профиль</span>
        </div>
      </div>

      {/* Profile information */}
      <ProfileCard user={user} businessInfo={user.businessInfo} />

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Навыки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.map((skill) => (
            <SkillProgressBar
              key={skill.type}
              name={skill.name}
              progress={skill.progress}
            />
          ))}
        </CardContent>
      </Card>

      {/* Progress */}
      <ProgressOverview
        completedLevels={completedLevelsCount}
        totalLevels={10}
        overallProgress={overallProgress}
      />

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Личные и контактные данные:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Имя:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Expected Output

```
- Profile page components:
  - /hooks/useProfile.ts (Hook for profile data)
  - /components/features/profile/SkillProgressBar.tsx (Skill progress visualization)
  - /components/features/profile/BadgeDisplay.tsx (Badge display component)
  - /components/features/profile/ProfileCard.tsx (User profile information)
  - /components/features/profile/ProgressOverview.tsx (Overall progress visualization)
  - /components/ui/progress.tsx (Progress bar component)
  - /app/(main)/profile/page.tsx (Updated profile page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - User profile and progress visualization

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout
   - Task 2.2: Build Level Map Component
   - Task 2.3: Implement Profile Page

   ## Current Issues
   - None

   ## Next Up
   - Task 2.4: Build Level Detail Page

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/profile.md` with a description of the profile system:
   ```markdown
   # Profile System

   ## Overview
   This document describes the profile system, which displays user information, progress tracking, and skill development.

   ## Components

   ### 1. ProfileCard
   - Displays user information and business details
   - Shows business description, employees, revenue, and goals
   - Includes button to complete business profile

   ### 2. SkillProgressBar
   - Visualizes progress in specific skill areas
   - Uses a dot-based progress indicator
   - Shows skill name and progress percentage

   ### 3. ProgressOverview
   - Shows overall progress through the learning path
   - Displays completed levels count and total levels
   - Includes progress bar for visual representation

   ### 4. BadgeDisplay
   - Shows achievement badges
   - Differentiates between achieved and locked badges
   - Displays badge name and icon

   ## Data Management

   ### useProfile Hook
   - Custom hook for accessing user profile and progress data
   - Combines user data from authentication with progress data
   - Provides formatted skill data and progress calculations
   - Handles loading states and errors

   ## Progress Tracking

   ### Skills Progress
   - Six main skill categories:
     - Personal Skills (Личные навыки и развитие)
     - Management (Управление и планирование)
     - Networking (Нетворкинг и связи)
     - Client Work (Работа с клиентами и продажи)
     - Finance (Финансовое управление)
     - Legal (Бухгалтерские и юр-е вопросы)
   - Progress percentage for each skill area
   - Visual representation with colored/gray dots

   ### Overall Progress
   - Tracks completed levels out of total levels
   - Calculates overall completion percentage
   - Shows progress with a progress bar

   ### Achievements
   - Badge system for recognizing accomplishments
   - Locked badges for future achievements
   - Visual indicators for earned badges

   ## Visual Design
   - Card-based layout for different information sections
   - Progress indicators using dots and bars
   - Consistent use of colors for status indicators
   - Responsive design for different screen sizes

   ## Implementation Details
   - React components with TypeScript
   - Tailwind CSS for styling
   - shadcn/ui for UI components
   - useProfile hook for data management
   ```

3. Create a snapshot document at `/docs/snapshots/profile.md`:
   ```markdown
   # Profile System Snapshot

   ## Purpose
   Display user information, progress tracking, and skill development

   ## Key Files
   - `/hooks/useProfile.ts` - Hook for profile data
   - `/components/features/profile/SkillProgressBar.tsx` - Skill progress visualization
   - `/components/features/profile/BadgeDisplay.tsx` - Badge display component
   - `/components/features/profile/ProfileCard.tsx` - User profile information
   - `/components/features/profile/ProgressOverview.tsx` - Overall progress visualization
   - `/app/(main)/profile/page.tsx` - Profile page

   ## State Management
   - User data from authentication context
   - Progress data from mock data (will be from Firestore in production)
   - Calculated skill progress and overall progress

   ## Data Flow
   1. useProfile hook combines user data and progress data
   2. Profile page organizes and displays different sections
   3. Individual components visualize specific aspects of progress
   4. User can see their overall progress, skill development, and achievements

   ## Key Decisions
   - Using a dot-based visualization for skill progress
   - Card-based layout for different information sections
   - Progress bar for overall progress visualization
   - Mock data for development with easy transition to Firestore

   ## Usage Example
   ```tsx
   import { useProfile } from '@/hooks/useProfile';
   import { SkillProgressBar } from '@/components/features/profile/SkillProgressBar';

   function SkillsSection() {
     const { getFormattedSkills } = useProfile();
     const skills = getFormattedSkills();
     
     return (
       <div className="space-y-4">
         {skills.map((skill) => (
           <SkillProgressBar
             key={skill.type}
             name={skill.name}
             progress={skill.progress}
           />
         ))}
       </div>
     );
   }
   ```

   ## Known Issues
   - None at this time
   ```

## Testing Instructions

1. Test the profile page:
   - Run the development server
   - Navigate to the profile page
   - Verify that all sections appear correctly (profile info, skills, progress, badges)
   - Check that the skill progress bars show the correct progress
   - Verify that the overall progress matches the completed levels

2. Test with different user data:
   - Modify the mock user data in useProfile hook
   - Check that the changes are reflected in the UI
   - Test with missing business information
   - Test with different badge statuses (achieved/locked)

3. Test responsive design:
   - Check the profile page on different screen sizes
   - Verify that the layout adjusts appropriately on mobile devices
   - Ensure that skill progress bars and badges display correctly on small screens

4. Test loading and error states:
   - Modify the useProfile hook to simulate loading state
   - Check that the loading indicator appears correctly
   - Modify the hook to simulate an error
   - Verify that the error message is displayed
