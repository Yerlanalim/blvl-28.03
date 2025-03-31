# Task 4.3: Implement Badges and Achievements

## Task Details

```
Task: Create badges and achievements system
Reference: Badge system mentioned in project description
Context: Users earn badges for completing levels and special actions
Current Files:
- /types/Progress.ts (Badge type already defined)
- /lib/services/progress-service.ts (checkAndAwardBadges function exists but needs enhancement)
- /hooks/useProgress.ts (getEarnedBadges function exists)
Previous Decision: Update badges when completing levels and special actions
```

## Context Recovery Steps

1. Review the project description document, particularly the Badge System section:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Progress type definitions that include Badge types:
   ```bash
   cat types/Progress.ts
   ```

4. Review the existing progress service that has badge-related functions:
   ```bash
   cat lib/services/progress-service.ts
   ```

5. Check the progress hook:
   ```bash
   cat hooks/useProgress.ts
   ```

## Implementation Steps

```
1. Create `/lib/services/badges-service.ts` for badge criteria and management:

```typescript
/**
 * @file badges-service.ts
 * @description Service for defining and managing badge criteria and awarding
 * @dependencies types/Progress
 */

import { Badge, UserProgress } from '@/types';

// Badge types for categorization
export enum BadgeCategory {
  PROGRESS = 'progress',
  VIDEOS = 'videos',
  TESTS = 'tests',
  ARTIFACTS = 'artifacts',
  SKILLS = 'skills',
  SPECIAL = 'special'
}

// Badge definition with criteria
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string; // Icon name from Lucide icons
  color: string; // Tailwind color class (e.g., 'amber-500')
  criteria: (progress: UserProgress) => boolean;
}

/**
 * All available badges in the system
 */
export const badgeDefinitions: BadgeDefinition[] = [
  // Progress badges
  {
    id: 'badge-first-level',
    name: 'First Steps',
    description: 'Completed your first level',
    category: BadgeCategory.PROGRESS,
    icon: 'award',
    color: 'amber-500',
    criteria: (progress) => progress.completedLevels.length >= 1
  },
  {
    id: 'badge-halfway',
    name: 'Halfway There',
    description: 'Completed 5 levels',
    category: BadgeCategory.PROGRESS,
    icon: 'milestone',
    color: 'amber-600',
    criteria: (progress) => progress.completedLevels.length >= 5
  },
  {
    id: 'badge-graduate',
    name: 'Business Graduate',
    description: 'Completed all 10 levels',
    category: BadgeCategory.PROGRESS,
    icon: 'graduation-cap',
    color: 'amber-700',
    criteria: (progress) => progress.completedLevels.length >= 10
  },
  
  // Video badges
  {
    id: 'badge-video-watcher',
    name: 'Video Enthusiast',
    description: 'Watched 10 videos',
    category: BadgeCategory.VIDEOS,
    icon: 'video',
    color: 'blue-500',
    criteria: (progress) => progress.watchedVideos.length >= 10
  },
  {
    id: 'badge-video-master',
    name: 'Video Master',
    description: 'Watched 25 videos',
    category: BadgeCategory.VIDEOS,
    icon: 'film',
    color: 'blue-700',
    criteria: (progress) => progress.watchedVideos.length >= 25
  },
  
  // Test badges
  {
    id: 'badge-quiz-taker',
    name: 'Quiz Taker',
    description: 'Completed 5 tests',
    category: BadgeCategory.TESTS,
    icon: 'clipboard-check',
    color: 'green-500',
    criteria: (progress) => progress.completedTests.length >= 5
  },
  {
    id: 'badge-quiz-master',
    name: 'Quiz Master',
    description: 'Completed 15 tests',
    category: BadgeCategory.TESTS,
    icon: 'check-circle-2',
    color: 'green-700',
    criteria: (progress) => progress.completedTests.length >= 15
  },
  
  // Artifact badges
  {
    id: 'badge-collector',
    name: 'Resource Collector',
    description: 'Downloaded 5 artifacts',
    category: BadgeCategory.ARTIFACTS,
    icon: 'download',
    color: 'purple-500',
    criteria: (progress) => progress.downloadedArtifacts.length >= 5
  },
  {
    id: 'badge-resource-master',
    name: 'Resource Master',
    description: 'Downloaded 15 artifacts',
    category: BadgeCategory.ARTIFACTS,
    icon: 'folder-down',
    color: 'purple-700',
    criteria: (progress) => progress.downloadedArtifacts.length >= 15
  },
  
  // Skill badges
  {
    id: 'badge-skill-starter',
    name: 'Skill Builder',
    description: 'Reach 25% in any skill category',
    category: BadgeCategory.SKILLS,
    icon: 'bar-chart',
    color: 'teal-500',
    criteria: (progress) => Object.values(progress.skillProgress).some(skillValue => skillValue >= 25)
  },
  {
    id: 'badge-skill-expert',
    name: 'Skill Expert',
    description: 'Reach 75% in any skill category',
    category: BadgeCategory.SKILLS,
    icon: 'trending-up',
    color: 'teal-700',
    criteria: (progress) => Object.values(progress.skillProgress).some(skillValue => skillValue >= 75)
  },
  {
    id: 'badge-skill-master',
    name: 'Skill Master',
    description: 'Reach 100% in any skill category',
    category: BadgeCategory.SKILLS,
    icon: 'award',
    color: 'teal-900',
    criteria: (progress) => Object.values(progress.skillProgress).some(skillValue => skillValue >= 100)
  },
  
  // Special badges
  {
    id: 'badge-all-rounder',
    name: 'All-Rounder',
    description: 'Have at least 25% in all skill categories',
    category: BadgeCategory.SPECIAL,
    icon: 'star',
    color: 'red-500',
    criteria: (progress) => Object.values(progress.skillProgress).every(skillValue => skillValue >= 25)
  },
  {
    id: 'badge-completionist',
    name: 'Completionist',
    description: 'Complete all levels, download all artifacts, and reach at least 50% in all skills',
    category: BadgeCategory.SPECIAL,
    icon: 'trophy',
    color: 'yellow-500',
    criteria: (progress) => 
      progress.completedLevels.length >= 10 && 
      progress.downloadedArtifacts.length >= 20 && 
      Object.values(progress.skillProgress).every(skillValue => skillValue >= 50)
  }
];

/**
 * Get a badge definition by ID
 */
export function getBadgeDefinition(badgeId: string): BadgeDefinition | undefined {
  return badgeDefinitions.find(badge => badge.id === badgeId);
}

/**
 * Get all badge definitions by category
 */
export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return badgeDefinitions.filter(badge => badge.category === category);
}

/**
 * Get all badge definitions
 */
export function getAllBadgeDefinitions(): BadgeDefinition[] {
  return badgeDefinitions;
}

/**
 * Check which badges a user has earned but not yet been awarded
 * 
 * @param progress User's current progress
 * @param currentBadges User's currently awarded badges
 * @returns Array of newly earned badge definitions
 */
export function checkNewBadges(progress: UserProgress): BadgeDefinition[] {
  // Get all badge IDs the user has already earned
  const earnedBadgeIds = progress.badges.map(badge => badge.id);
  
  // Find badges that match criteria but haven't been awarded yet
  return badgeDefinitions.filter(badge => 
    !earnedBadgeIds.includes(badge.id) && 
    badge.criteria(progress)
  );
}

/**
 * Convert a badge definition to a user badge
 */
export function createUserBadge(badgeDefinition: BadgeDefinition): Badge {
  return {
    id: badgeDefinition.id,
    name: badgeDefinition.name,
    description: badgeDefinition.description,
    achieved: true,
    achievedAt: new Date().toISOString()
  };
}
```

2. Enhance `/lib/services/progress-service.ts` to integrate enhanced badge logic:

```typescript
// At the top of the file, add this import:
import { 
  checkNewBadges, 
  createUserBadge,
  getBadgeDefinition
} from './badges-service';

// Replace the checkAndAwardBadges function with this enhanced version:

/**
 * Check and award badges
 * 
 * Examines the user's progress and awards any earned badges
 */
export async function checkAndAwardBadges(userId: string): Promise<Badge[]> {
  try {
    // Get current progress
    const progress = await getUserProgress(userId);
    if (!progress) return [];
    
    // Check for new badges
    const newBadgeDefinitions = checkNewBadges(progress);
    
    // If no badges to award, return early
    if (newBadgeDefinitions.length === 0) {
      return [];
    }
    
    // Convert badge definitions to user badges
    const newBadges = newBadgeDefinitions.map(definition => 
      createUserBadge(definition)
    );
    
    // Update progress with new badges
    const updatedProgress = {
      ...progress,
      badges: [...progress.badges, ...newBadges],
      lastUpdated: new Date().toISOString()
    };
    
    // In a real app, we'd update Firestore:
    // for (const badge of newBadges) {
    //   await updateDoc(doc(db, 'userProgress', userId), {
    //     badges: arrayUnion(badge),
    //     lastUpdated: serverTimestamp()
    //   });
    // }
    
    // For MVP, we'll use localStorage
    localStorage.setItem(STORAGE_KEY + '_' + userId, JSON.stringify(updatedProgress));
    
    // In a real app, we might also send a notification about new badges
    console.log('Badges awarded:', newBadges);
    
    return newBadges;
  } catch (error) {
    console.error('Error awarding badges:', error);
    throw error;
  }
}
```

3. Create `/components/features/badges/BadgeCard.tsx`:

```typescript
/**
 * @file BadgeCard.tsx
 * @description Component for displaying a badge with icon and details
 */

import React from 'react';
import { Icon } from '@/components/ui/icon';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/types';
import { getBadgeDefinition } from '@/lib/services/badges-service';
import { formatDistanceToNow } from 'date-fns';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BadgeCard component
 * 
 * Displays a badge with icon, name, and description
 */
export function BadgeCard({ badge, size = 'md' }: BadgeCardProps) {
  // Get badge definition for additional metadata
  const badgeDefinition = getBadgeDefinition(badge.id);
  
  // Size classes for different badge sizes
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  // Icon sizes for different badge sizes
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  // Check if the badge is achieved
  const isAchieved = badge.achieved;
  
  // Format achieved date if available
  const achievedDate = badge.achievedAt 
    ? formatDistanceToNow(new Date(badge.achievedAt), { addSuffix: true })
    : undefined;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`w-full ${isAchieved ? 'bg-white' : 'bg-gray-100'}`}>
            <CardContent className={`${sizeClasses[size]} flex flex-col items-center text-center`}>
              <div className={`
                mb-2 p-3 rounded-full 
                ${isAchieved 
                  ? `bg-${badgeDefinition?.color || 'amber-100'} text-${badgeDefinition?.color.replace('500', '700') || 'amber-700'}` 
                  : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Icon 
                  name={badgeDefinition?.icon || 'award'} 
                  className={iconSizes[size]} 
                  strokeWidth={1.5}
                />
              </div>
              
              <h4 className="text-sm font-medium">
                {badge.name}
              </h4>
              
              {!isAchieved && (
                <span className="text-xs text-gray-500 mt-1">Locked</span>
              )}
              
              {isAchieved && achievedDate && size !== 'sm' && (
                <span className="text-xs text-gray-500 mt-1">
                  Earned {achievedDate}
                </span>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{badge.name}</p>
          <p className="text-sm">{badge.description}</p>
          {isAchieved && achievedDate && (
            <p className="text-xs text-gray-500 mt-1">Earned {achievedDate}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

4. Create `/components/ui/icon.tsx`:

```typescript
/**
 * @file icon.tsx
 * @description Dynamic icon component using Lucide icons
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

/**
 * Dynamic icon component
 * 
 * Renders a Lucide icon by name
 */
export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name]);

  return <LucideIcon {...props} />;
};
```

5. Create `/components/features/badges/BadgeGrid.tsx`:

```typescript
/**
 * @file BadgeGrid.tsx
 * @description Grid component for displaying multiple badges
 */

import React from 'react';
import { Badge } from '@/types';
import { BadgeCard } from './BadgeCard';

interface BadgeGridProps {
  badges: Badge[];
  emptyMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  columns?: 2 | 3 | 4 | 6;
}

/**
 * BadgeGrid component
 * 
 * Displays a grid of badges
 */
export function BadgeGrid({ 
  badges, 
  emptyMessage = 'No badges yet. Complete levels to earn badges!',
  size = 'md',
  columns = 3
}: BadgeGridProps) {
  if (!badges.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Column classes for different grid layouts
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4`}>
      {badges.map(badge => (
        <BadgeCard key={badge.id} badge={badge} size={size} />
      ))}
    </div>
  );
}
```

6. Create `/components/features/badges/AchievementNotification.tsx`:

```typescript
/**
 * @file AchievementNotification.tsx
 * @description Notification component for newly earned badges
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/types';
import { BadgeCard } from './BadgeCard';
import { getBadgeDefinition } from '@/lib/services/badges-service';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';

interface AchievementNotificationProps {
  badge: Badge;
  onClose: () => void;
}

/**
 * AchievementNotification component
 * 
 * Displays a modal notification when a user earns a new badge
 */
export function AchievementNotification({ badge, onClose }: AchievementNotificationProps) {
  const [open, setOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get badge definition
  const badgeDefinition = getBadgeDefinition(badge.id);
  
  // Show confetti effect after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle close
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Achievement Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center">
              You've earned a new badge
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <div className="w-48">
              <BadgeCard badge={badge} size="lg" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl">{badge.name}</h3>
            <p className="text-gray-600">{badge.description}</p>
          </div>
          
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

7. Create `/components/ui/confetti.tsx`:

```typescript
/**
 * @file confetti.tsx
 * @description Confetti animation component for celebrations
 */

import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  duration?: number;
}

/**
 * Confetti component
 * 
 * Displays a confetti animation effect
 */
export function Confetti({ duration = 3000 }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isActive, setIsActive] = useState(true);
  
  // Get window dimensions
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Set initial dimensions
    handleResize();
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    
    // Set timeout to remove confetti
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [duration]);
  
  if (!isActive) return null;
  
  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
    />
  );
}
```

8. Update `/hooks/useProgress.ts` to expose badge functionality:

```typescript
// Add these imports to the top
import { 
  getAllBadgeDefinitions, 
  getBadgeDefinition, 
  getBadgesByCategory,
  BadgeCategory
} from '@/lib/services/badges-service';

// Add these functions inside the hook's return object:

/**
 * Get all badge definitions
 */
const getAllBadges = useCallback(() => {
  return getAllBadgeDefinitions();
}, []);

/**
 * Get badges by category
 */
const getBadgesByType = useCallback((category: BadgeCategory) => {
  return getBadgesByCategory(category);
}, []);

/**
 * Get badge details
 */
const getBadgeDetails = useCallback((badgeId: string) => {
  return getBadgeDefinition(badgeId);
}, []);

/**
 * Get earned badges with additional details
 */
const getDetailedBadges = useCallback(() => {
  if (!progress) return [];
  
  return progress.badges.map(badge => {
    const details = getBadgeDefinition(badge.id);
    return {
      ...badge,
      icon: details?.icon || 'award',
      color: details?.color || 'amber-500',
      category: details?.category || BadgeCategory.PROGRESS
    };
  });
}, [progress]);

// Add these to the return object
return {
  // ...existing returns
  getAllBadges,
  getBadgesByType,
  getBadgeDetails,
  getDetailedBadges,
  BadgeCategory,
  // Make sure these exist in the return
  getEarnedBadges,
  trackLevelCompleted
};
```

9. Add notification system for new badges in `/context/UIContext.tsx`:

```typescript
/**
 * @file UIContext.tsx
 * @description Context for UI state and notifications
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Badge } from '@/types';
import { AchievementNotification } from '@/components/features/badges/AchievementNotification';

interface UIContextType {
  showAchievementNotification: (badge: Badge) => void;
}

// Create the context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Custom hook to use the UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

// Props for the UI provider
interface UIProviderProps {
  children: ReactNode;
}

// UI provider component
export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  
  // Show achievement notification
  const showAchievementNotification = (badge: Badge) => {
    setNewBadge(badge);
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNewBadge(null);
  };
  
  const value = {
    showAchievementNotification
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
      
      {/* Render achievement notification if there's a new badge */}
      {newBadge && (
        <AchievementNotification
          badge={newBadge}
          onClose={handleNotificationClose}
        />
      )}
    </UIContext.Provider>
  );
};
```

10. Update `/app/providers.tsx` to include UIProvider:

```typescript
// Add this import at the top
import { UIProvider } from '@/context/UIContext';

// Update the Providers component to include UIProvider
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

11. Update progress-service.ts to show notifications:

```typescript
// Add this import at the top
import { useUI } from '@/context/UIContext';

// Add the following to the trackLevelCompleted function in useProgress.ts:

// Inside the trackLevelCompleted function, after calling completeLevel
const trackLevelCompleted = useCallback(async (levelId: string, levelData: any) => {
  if (!user || !progress) return false;
  
  try {
    setIsUpdating(true);
    
    // Call the service function to complete the level
    const result = await completeLevel(user.id, levelId, levelData);
    
    // Check for new badges if successful
    if (result) {
      const newBadges = await checkAndAwardBadges(user.id);
      
      // Show notification for each new badge
      if (newBadges.length > 0) {
        // Get the UI context
        const { showAchievementNotification } = useUI();
        
        // Show notification for the first badge (to avoid overwhelming the user)
        showAchievementNotification(newBadges[0]);
      }
    }
    
    // Reload progress to get updated skills and badges
    const updatedProgress = await getUserProgress(user.id);
    setProgress(updatedProgress);
    
    setIsUpdating(false);
    return true;
  } catch (err) {
    console.error('Error completing level:', err);
    setError(err instanceof Error ? err : new Error('Failed to complete level'));
    setIsUpdating(false);
    return false;
  }
}, [user, progress]);
```

12. Update `/app/(main)/profile/page.tsx` to display badges:

```typescript
// Add these imports at the top
import { BadgeGrid } from '@/components/features/badges/BadgeGrid';
import { BadgeCategory } from '@/lib/services/badges-service';

// Add this section after the ProgressOverview component
{/* Badges */}
<Card>
  <CardHeader>
    <CardTitle className="text-lg">Достижения</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      <BadgeGrid badges={getEarnedBadges()} columns={3} size="md" />
    </div>
  </CardContent>
</Card>
```

## Expected Output

```
- Badge system files:
  - /lib/services/badges-service.ts (Badge definition and awarding logic)
  - /components/features/badges/BadgeCard.tsx (Badge display component)
  - /components/features/badges/BadgeGrid.tsx (Grid of badges)
  - /components/features/badges/AchievementNotification.tsx (Badge earned notification)
  - /components/ui/icon.tsx (Dynamic icon component)
  - /components/ui/confetti.tsx (Celebration effect)
  - /context/UIContext.tsx (UI state and notifications)
  - Updates to:
    - /lib/services/progress-service.ts
    - /hooks/useProgress.ts
    - /app/providers.tsx
    - /app/(main)/profile/page.tsx
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Completing badges and achievements system

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
   - Task 4.3: Implement Badges and Achievements

   ## Current Issues
   - None

   ## Next Up
   - System testing and final integration

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
   - Badges: Complete (Badge system and achievement notifications)
   ```

2. Create `/docs/features/badges.md` with a description of the badge system:
   ```markdown
   # Badge System

   ## Overview
   This document describes the badge system used in the BizLevel application for user achievement and gamification.

   ## Components

   ### 1. BadgeCard
   - Visual representation of individual badges
   - Shows icon, name, and locked/unlocked status
   - Displays tooltips with achievement details
   - Adjustable size (small, medium, large)

   ### 2. BadgeGrid
   - Grid display of multiple badges
   - Customizable columns and layout
   - Handles empty state with message
   - Responsive design for different screen sizes

   ### 3. AchievementNotification
   - Modal notification when badges are earned
   - Confetti animation for celebration
   - Displays badge details and achievement date
   - Appears automatically after certain actions

   ## Badge Management

   ### BadgeService
   - Defines all available badges and their requirements
   - Organizes badges into categories
   - Checks user progress against badge criteria
   - Creates badge instances when earned

   ### Badge Categories
   - Progress: Level completion milestones
   - Videos: Video watching achievements
   - Tests: Quiz completion achievements
   - Artifacts: Resource download achievements
   - Skills: Skill development achievements
   - Special: Special combination achievements

   ## Badge Awarding

   ### Criteria Evaluation
   - Each badge has a criteria function that evaluates user progress
   - System automatically checks for newly earned badges
   - Badges are awarded immediately when criteria are met

   ### Award Process
   1. User completes an action (level, video, test, download)
   2. System checks if any badge criteria are now met
   3. New badges are added to user's profile
   4. Achievement notification appears with animation
   5. Badge appears in profile page

   ## UI Integration

   ### Profile Page Display
   - Grid of earned badges in profile page
   - Visual indicators for locked/unlocked status
   - Details available on hover/click

   ### Achievement Notifications
   - Modal popup when new badges are earned
   - Confetti animation for celebration effect
   - Clear description of the achievement
   - Appears during normal gameplay
   ```

3. Create a snapshot document at `/docs/snapshots/badges.md`:
   ```markdown
   # Badge System Snapshot

   ## Purpose
   Provide gamification through achievements and recognition of user progress

   ## Key Files
   - `/lib/services/badges-service.ts` - Badge definition and criteria
   - `/components/features/badges/BadgeCard.tsx` - Badge display component
   - `/components/features/badges/BadgeGrid.tsx` - Grid of badges
   - `/components/features/badges/AchievementNotification.tsx` - Notification component
   - `/components/ui/icon.tsx` - Dynamic icon component
   - `/components/ui/confetti.tsx` - Celebration effect component
   - `/context/UIContext.tsx` - UI state for notifications

   ## State Management
   - Badge definitions stored in badges-service.ts
   - Earned badges stored in user progress data
   - Notification state managed by UIContext
   - Badge criteria evaluated during progress updates

   ## Data Flow
   1. User completes an action (level, video, etc.)
   2. Progress service updates user progress
   3. Badge service checks for newly earned badges
   4. New badges are added to user's profile
   5. UI context shows achievement notification
   6. Badge appears in profile page

   ## Key Decisions
   - Badge categories for organization (progress, videos, tests, etc.)
   - Visual distinction between earned and locked badges
   - Celebratory notification system with confetti
   - Dynamic criteria functions for flexible achievement rules
   - Progressive achievement system with increasing difficulty

   ## Usage Example
   ```tsx
   import { useProgress } from '@/hooks/useProgress';
   import { BadgeGrid } from '@/components/features/badges/BadgeGrid';

   function BadgesSection() {
     const { getEarnedBadges } = useProgress();
     
     return (
       <div>
         <h2>Your Achievements</h2>
         <BadgeGrid badges={getEarnedBadges()} />
       </div>
     );
   }
   ```

   ## Known Issues
   - None
   ```

## Testing Instructions

1. Test badge awarding:
   - Run the development server
   - Navigate to the profile page
   - Check initial badges (if any)
   - Complete a level to trigger badge checks
   - Verify that appropriate badges are awarded
   - Check that notifications appear

2. Test badge display:
   - Navigate to the profile page
   - Verify that badges are displayed in the grid
   - Check that tooltips work with badge details
   - Verify that locked and unlocked badges are visually distinct

3. Test different badge criteria:
   - Complete different actions that should award badges
   - Watch videos to earn video-related badges
   - Complete tests to earn test-related badges
   - Download artifacts to earn resource-related badges
   - Level up skills to earn skill-related badges

4. Test edge cases:
   - Verify that badges aren't awarded twice
   - Check behavior with no earned badges
   - Test how many badges can be displayed at once
   - Verify mobile responsiveness of badge grid
