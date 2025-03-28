# Task 3.1: Implement Artifacts System

## Task Details

```
Task: Create artifacts management system
Reference: Implementation Notes and UI Reference (Image 6) in project description
Context: Artifacts are downloadable resources for each level
Current Files:
- /types/Artifact.ts (Artifact type definitions)
- /lib/data/levels.ts (Mock level data with artifacts)
- /lib/data/user-progress.ts (Mock progress data with downloaded artifacts)
- /components/features/level/ArtifactDownload.tsx (Basic artifact download component)
- /app/(main)/artifacts/page.tsx (Artifacts page placeholder)
Previous Decision: Follow the UI design in Image 6 with artifact cards and download tracking
```

## Context Recovery Steps

1. Review the project description document, particularly the Artifacts section in Implementation Notes:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Artifact type definitions:
   ```bash
   cat types/Artifact.ts
   ```

4. Review the existing artifact download component:
   ```bash
   cat components/features/level/ArtifactDownload.tsx
   ```

## Implementation Steps

```
1. Create `/hooks/useArtifacts.ts` for managing artifact data:

```typescript
/**
 * @file useArtifacts.ts
 * @description Hook for accessing artifact data and user interactions
 * @dependencies lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Artifact, ArtifactFileType, LevelArtifact } from '@/types';
import { getLevels } from '@/lib/data/levels';
import { getUserProgress, isArtifactDownloaded } from '@/lib/data/user-progress';

/**
 * Combined artifact information with level details and download status
 */
export interface ArtifactWithMeta extends Artifact {
  levelTitle: string;
  levelId: string;
  levelOrder: number;
  isDownloaded: boolean;
}

/**
 * Hook for accessing and managing artifact data
 */
export function useArtifacts() {
  const { user } = useAuth();
  const [artifacts, setArtifacts] = useState<ArtifactWithMeta[]>([]);
  const [downloadedArtifacts, setDownloadedArtifacts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all artifacts from levels
  useEffect(() => {
    try {
      // Get all levels
      const levels = getLevels();
      
      // Extract artifacts from levels
      const allArtifacts: ArtifactWithMeta[] = [];
      levels.forEach(level => {
        level.artifacts.forEach(artifact => {
          allArtifacts.push({
            id: artifact.id,
            title: artifact.title,
            description: artifact.description,
            fileUrl: artifact.fileUrl,
            fileType: artifact.fileType as ArtifactFileType,
            levelId: level.id,
            levelTitle: level.title,
            levelOrder: level.order,
            isDownloaded: false, // Will be updated below
            createdAt: new Date().toISOString(), // Mock date
            updatedAt: new Date().toISOString(), // Mock date
            downloadCount: 0
          });
        });
      });
      
      // Sort artifacts by level order
      allArtifacts.sort((a, b) => a.levelOrder - b.levelOrder);
      
      // Get user progress for download status
      if (user) {
        const progress = getUserProgress(user.id);
        
        // Update download status
        allArtifacts.forEach(artifact => {
          artifact.isDownloaded = isArtifactDownloaded(artifact.id, progress);
        });
        
        // Save downloaded artifacts list
        setDownloadedArtifacts(progress.downloadedArtifacts);
      }
      
      setArtifacts(allArtifacts);
      setLoading(false);
    } catch (err) {
      console.error('Error loading artifacts:', err);
      setError(err instanceof Error ? err : new Error('Failed to load artifacts'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback((artifactId: string) => {
    if (!artifactId || !user) return;
    
    // Update local state
    setArtifacts(prev => prev.map(artifact => 
      artifact.id === artifactId 
        ? { ...artifact, isDownloaded: true } 
        : artifact
    ));
    
    setDownloadedArtifacts(prev => 
      prev.includes(artifactId) ? prev : [...prev, artifactId]
    );
    
    // In a real app, we would update this in Firestore
    console.log(`Artifact ${artifactId} marked as downloaded`);
  }, [user]);

  /**
   * Filter artifacts by type
   */
  const filterByType = useCallback((fileType?: ArtifactFileType | 'all') => {
    if (!fileType || fileType === 'all') return artifacts;
    return artifacts.filter(a => a.fileType === fileType);
  }, [artifacts]);

  /**
   * Search artifacts by title or description
   */
  const searchArtifacts = useCallback((query: string) => {
    if (!query) return artifacts;
    
    const lowerQuery = query.toLowerCase();
    return artifacts.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.description.toLowerCase().includes(lowerQuery)
    );
  }, [artifacts]);

  /**
   * Get artifacts by level
   */
  const getArtifactsByLevel = useCallback((levelId: string) => {
    return artifacts.filter(a => a.levelId === levelId);
  }, [artifacts]);

  /**
   * Get downloaded artifacts
   */
  const getDownloadedArtifacts = useCallback(() => {
    return artifacts.filter(a => a.isDownloaded);
  }, [artifacts]);

  /**
   * Check if an artifact is downloaded
   */
  const isDownloaded = useCallback((artifactId: string) => {
    return downloadedArtifacts.includes(artifactId);
  }, [downloadedArtifacts]);

  return {
    artifacts,
    downloadedArtifacts,
    loading,
    error,
    markArtifactDownloaded,
    filterByType,
    searchArtifacts,
    getArtifactsByLevel,
    getDownloadedArtifacts,
    isDownloaded
  };
}
```

2. Create `/components/features/artifacts/ArtifactCard.tsx`:

```typescript
/**
 * @file ArtifactCard.tsx
 * @description Card component for displaying artifact information
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileIcon, 
  DownloadIcon, 
  CheckIcon, 
  ExternalLinkIcon
} from 'lucide-react';
import { ArtifactWithMeta } from '@/hooks/useArtifacts';

interface ArtifactCardProps {
  artifact: ArtifactWithMeta;
  onDownload: () => void;
}

/**
 * ArtifactCard component
 * 
 * Displays an artifact with download button and related level
 */
export function ArtifactCard({ artifact, onDownload }: ArtifactCardProps) {
  // Determine icon based on file type
  const getFileIcon = () => {
    switch (artifact.fileType) {
      case 'pdf':
        return <FileIcon className="w-5 h-5 text-red-500" />;
      case 'spreadsheet':
        return <FileIcon className="w-5 h-5 text-green-500" />;
      case 'doc':
        return <FileIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  const handleDownload = () => {
    // Trigger the download
    onDownload();
    
    // Simulate opening the file in a new tab
    window.open(artifact.fileUrl, '_blank');
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            {getFileIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{artifact.title}</h3>
            <p className="text-gray-600 mt-1">{artifact.description}</p>
            <p className="text-sm text-gray-500 mt-3">
              From Level {artifact.levelOrder}: {artifact.levelTitle}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleDownload}
          variant={artifact.isDownloaded ? "outline" : "default"}
          className={artifact.isDownloaded ? 'bg-green-50 text-green-700 border-green-200' : ''}
        >
          {artifact.isDownloaded ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Downloaded
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
        
        <Link href={`/level/${artifact.levelId}`}>
          <Button variant="outline">
            Go to Related Lesson
            <ExternalLinkIcon className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
```

3. Create `/components/features/artifacts/ArtifactFilters.tsx`:

```typescript
/**
 * @file ArtifactFilters.tsx
 * @description Component for filtering and searching artifacts
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArtifactFileType } from '@/types';
import { SearchIcon, FileIcon, XIcon } from 'lucide-react';

interface ArtifactFiltersProps {
  onFilterChange: (fileType: ArtifactFileType | 'all') => void;
  onSearchChange: (query: string) => void;
}

/**
 * ArtifactFilters component
 * 
 * Provides search and filter controls for artifacts
 */
export function ArtifactFilters({ 
  onFilterChange, 
  onSearchChange 
}: ArtifactFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<ArtifactFileType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle filter button click
  const handleFilterClick = (filter: ArtifactFileType | 'all') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  // File type filters
  const filters = [
    { label: 'All', value: 'all' as const },
    { label: 'PDF', value: 'pdf' as ArtifactFileType },
    { label: 'Spreadsheet', value: 'spreadsheet' as ArtifactFileType },
    { label: 'Document', value: 'doc' as ArtifactFileType }
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search artifacts..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={handleSearchInput}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(filter.value)}
            className={activeFilter === filter.value ? '' : 'text-gray-700'}
          >
            {filter.value !== 'all' && (
              <FileIcon className={`h-4 w-4 mr-2 ${
                filter.value === 'pdf' ? 'text-red-500' :
                filter.value === 'spreadsheet' ? 'text-green-500' :
                filter.value === 'doc' ? 'text-blue-500' : ''
              }`} />
            )}
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

4. Create `/components/features/artifacts/ArtifactEmptyState.tsx`:

```typescript
/**
 * @file ArtifactEmptyState.tsx
 * @description Component for showing empty state when no artifacts are found
 */

import React from 'react';
import { FileX } from 'lucide-react';

interface ArtifactEmptyStateProps {
  message?: string;
}

/**
 * ArtifactEmptyState component
 * 
 * Shows a message when no artifacts are found
 */
export function ArtifactEmptyState({ 
  message = "No artifacts found matching your criteria" 
}: ArtifactEmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <FileX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No artifacts found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
}
```

5. Update `/app/(main)/artifacts/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Artifacts page for listing and downloading resources
 * @dependencies hooks/useArtifacts, components/features/artifacts/*
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useArtifacts, ArtifactWithMeta } from '@/hooks/useArtifacts';
import { ArtifactCard } from '@/components/features/artifacts/ArtifactCard';
import { ArtifactFilters } from '@/components/features/artifacts/ArtifactFilters';
import { ArtifactEmptyState } from '@/components/features/artifacts/ArtifactEmptyState';
import { ArtifactFileType } from '@/types';

export default function ArtifactsPage() {
  const { 
    artifacts, 
    loading, 
    error, 
    markArtifactDownloaded 
  } = useArtifacts();
  
  // Filter and search state
  const [fileTypeFilter, setFileTypeFilter] = useState<ArtifactFileType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filters to artifacts
  const filteredArtifacts = useMemo(() => {
    let result = [...artifacts];
    
    // Apply file type filter
    if (fileTypeFilter !== 'all') {
      result = result.filter(artifact => artifact.fileType === fileTypeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(artifact => 
        artifact.title.toLowerCase().includes(query) ||
        artifact.description.toLowerCase().includes(query) ||
        artifact.levelTitle.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [artifacts, fileTypeFilter, searchQuery]);
  
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
        Error loading artifacts: {error.message}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Link href="/map" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to</span>
        </Link>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold">Artifacts &amp; Resources</h1>
        <p className="text-gray-600 mt-1">All your course resources in one place.</p>
      </div>

      {/* Filters */}
      <ArtifactFilters
        onFilterChange={setFileTypeFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Artifacts list */}
      <div className="space-y-6">
        {filteredArtifacts.length > 0 ? (
          filteredArtifacts.map(artifact => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onDownload={() => markArtifactDownloaded(artifact.id)}
            />
          ))
        ) : (
          <ArtifactEmptyState message={
            searchQuery 
              ? `No artifacts found matching "${searchQuery}"`
              : `No ${fileTypeFilter !== 'all' ? fileTypeFilter : ''} artifacts found`
          } />
        )}
      </div>
      
      {/* Helper text */}
      <div className="text-center text-gray-500 text-sm pt-4 border-t">
        Need more tools? Check the <Link href="/chat" className="text-teal-600 hover:text-teal-700">Chat</Link> or <Link href="/faq" className="text-teal-600 hover:text-teal-700">FAQ</Link>
      </div>
    </div>
  );
}
```

## Expected Output

```
- Artifacts system files:
  - /hooks/useArtifacts.ts (Hook for artifact data management)
  - /components/features/artifacts/ArtifactCard.tsx (Artifact display card)
  - /components/features/artifacts/ArtifactFilters.tsx (Search and filter controls)
  - /components/features/artifacts/ArtifactEmptyState.tsx (Empty state display)
  - /app/(main)/artifacts/page.tsx (Updated artifacts page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Artifacts system implementation

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

   ## Current Issues
   - None

   ## Next Up
   - Task 3.2: Implement Chat Interface

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/artifacts.md` with a description of the artifacts system:
   ```markdown
   # Artifacts System

   ## Overview
   This document describes the artifacts system, which provides users with downloadable resources and practical tools for applying their learning.

   ## Components

   ### 1. ArtifactCard
   - Displays artifact information, including title, description, and file type
   - Shows the associated level
   - Provides download button and link to related level
   - Visually indicates download status

   ### 2. ArtifactFilters
   - Search functionality for finding artifacts by title or description
   - Filter controls for narrowing down by file type
   - Clear visual indication of active filters

   ### 3. ArtifactEmptyState
   - Displays a message when no artifacts match the search/filter criteria
   - Provides contextual information about the current filters

   ## Data Management

   ### useArtifacts Hook
   - Aggregates artifacts data from all levels
   - Tracks download status
   - Provides filtering and search functionality
   - Manages artifact interactions (downloads)
   - Groups artifacts by level or file type

   ## Artifact Types

   ### Supported File Types
   - PDF documents
   - Spreadsheets
   - Documents

   ### Artifact Metadata
   - Title and description
   - File URL and type
   - Associated level
   - Download status
   - Download count (for analytics)

   ## User Interactions

   ### Searching and Filtering
   - Text search across titles and descriptions
   - Filtering by file type
   - Combination of search and filters

   ### Downloading Artifacts
   - Direct download links
   - Download status tracking
   - Navigation to source levels

   ## Implementation Details
   - React components with TypeScript
   - Search and filter functionality
   - Integration with level completion system
   - Real file URLs but simulated downloads in the prototype
   - Download tracking will use Firestore in production
   ```

3. Create a snapshot document at `/docs/snapshots/artifacts.md`:
   ```markdown
   # Artifacts System Snapshot

   ## Purpose
   Provide a centralized library of downloadable resources across all levels

   ## Key Files
   - `/hooks/useArtifacts.ts` - Hook for artifact data management
   - `/components/features/artifacts/ArtifactCard.tsx` - Artifact display card
   - `/components/features/artifacts/ArtifactFilters.tsx` - Search and filter controls
   - `/components/features/artifacts/ArtifactEmptyState.tsx` - Empty state display
   - `/app/(main)/artifacts/page.tsx` - Artifacts listing page

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
   ```

## Testing Instructions

1. Test the artifacts page:
   - Run the development server
   - Navigate to the artifacts page
   - Verify that all artifacts from all levels are listed
   - Check that the cards show the correct information (title, description, level)

2. Test filtering and search:
   - Use the filter buttons to filter by file type
   - Enter search terms in the search bar
   - Verify that only matching artifacts are displayed
   - Test combinations of filters and search
   - Test empty state when no results are found

3. Test artifact downloads:
   - Click the download button on an artifact
   - Verify that the download status updates (button changes to "Downloaded")
   - Navigate to the level detail page and confirm the download status is consistent

4. Test navigation between artifacts and levels:
   - Click "Go to Related Lesson" on an artifact card
   - Verify that it navigates to the correct level
   - Navigate back to the artifacts page and confirm the state is preserved

5. Test edge cases:
   - Search for non-existent artifacts
   - Clear search and filters
   - Test with different file types
   - Test the page layout on different screen sizes
