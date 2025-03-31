# Progress Tracking System Snapshot

## Purpose
Track user progress through the learning platform for gamification and personalization

## Key Files
- `/lib/services/progress-service.ts` - Core progress tracking service
- `/hooks/useProgress.ts` - Hook for progress management
- `/hooks/useLevel.ts` - Updated to use progress hook
- `/hooks/useLevels.ts` - Updated to use progress hook
- `/hooks/useArtifacts.ts` - Updated to use progress hook
- `/components/features/admin/ProgressDebugPanel.tsx` - Debug component

## State Management
- Progress data stored in localStorage (MVP) or Firestore (production)
- React hooks provide component access to progress data
- Loading and updating states for asynchronous operations
- Centralized service for data consistency

## Data Flow
1. User performs action (watches video, completes test, etc.)
2. Component calls appropriate tracking function from hook
3. Hook calls progress service to update data
4. Service persists changes and calculates derived data (skills, badges)
5. Updated data flows back to components through hooks
6. UI updates to reflect progress changes

## Key Decisions
- Separation of concerns between UI and data management
- Centralized service for consistent data operations
- Local storage for MVP to avoid Firebase dependency
- Hook-based API for React component integration
- Automatic skill progress calculation based on level completion

## Usage Example
```tsx
import { useProgress } from '@/hooks/useProgress';

function VideoComponent({ videoId, duration }) {
  const { trackVideoWatched, isVideoWatched } = useProgress();
  
  const handleVideoComplete = () => {
    trackVideoWatched(videoId, duration);
  };
  
  return (
    <div>
      <video onEnded={handleVideoComplete}>...</video>
      {isVideoWatched(videoId) && <div>✓ Watched</div>}
    </div>
  );
}
```

## Known Issues
- localStorage has limited storage capacity
- No offline sync capabilities in MVP
- Will need migration strategy when moving to Firestore 