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