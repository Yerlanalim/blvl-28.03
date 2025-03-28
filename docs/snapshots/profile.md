# Profile System Snapshot

## Purpose
Display user information, progress tracking, and skill development

## Key Files
- `/hooks/useProfile.ts` - Hook for profile data
- `/components/features/profile/SkillProgressBar.tsx` - Skill progress visualization
- `/components/features/profile/BadgeDisplay.tsx` - Badge display component
- `/components/features/profile/ProfileCard.tsx` - User profile information
- `/components/features/profile/ProgressOverview.tsx` - Overall progress visualization
- `/app/(routes)/profile/page.tsx` - Profile page

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