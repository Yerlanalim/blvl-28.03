# Artifacts System Snapshot

## Purpose
Provide a centralized library of downloadable resources across all levels

## Key Files
- `/hooks/useArtifacts.ts` - Hook for artifact data management
- `/components/features/artifacts/ArtifactCard.tsx` - Artifact display card
- `/components/features/artifacts/ArtifactFilters.tsx` - Search and filter controls
- `/components/features/artifacts/ArtifactEmptyState.tsx` - Empty state display
- `/app/(routes)/artifacts/page.tsx` - Artifacts listing page

## State Management
- Artifact data aggregated from all levels
- Download status tracked per artifact
- Search query and filter state managed locally
- Downloaded artifacts list synchronized with user progress

## Data Flow
1. useArtifacts hook aggregates artifacts from all levels
2. User's download history determines initial download status
3. User can filter and search for specific artifacts
4. Downloading an artifact updates local state (will update Firestore in production)
5. Download status reflects in both the artifacts page and level detail page

## Key Decisions
- Centralized artifact library separate from level context
- Direct integration with original level for context
- File type filtering for easier resource discovery
- Visual indicators for file types and download status

## Usage Example
```tsx
import { useArtifacts } from '@/hooks/useArtifacts';
import { ArtifactCard } from '@/components/features/artifacts/ArtifactCard';

function ArtifactsList() {
  const { artifacts, markArtifactDownloaded } = useArtifacts();
  
  return (
    <div>
      {artifacts.map(artifact => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          onDownload={() => markArtifactDownloaded(artifact.id)}
        />
      ))}
    </div>
  );
}
```

## Known Issues
- File downloads are simulated in the prototype
- No file upload functionality for admin interface yet 