# BizLevel Project Description

This document serves as the central reference for the BizLevel platform development, designed to be referenced by Claude 3.7 throughout the development process with Cursor IDE.

> **IMPORTANT**: Always review this document at the beginning of each development session to maintain context. When Cursor loses context, this document should be your first reference point.

## Core Concept

BizLevel is an educational platform (web application) that helps entrepreneurs and managers improve business skills through:
- Short-format videos (2-4 minutes each)
- Interactive tests and quizzes
- Downloadable practical artifacts (templates, checklists, etc.)
- Gamified progression through 10 levels
- Skill development tracking across 6 business competencies

## File Naming Conventions

To maintain consistency across the project, follow these naming patterns:

1. **Components**: PascalCase - `LevelCard.tsx`, `SkillProgressBar.tsx`
2. **Hooks**: camelCase with 'use' prefix - `useAuth.ts`, `useLevelProgress.ts`
3. **Utilities**: camelCase - `formatDate.ts`, `calculateProgress.ts`
4. **Context**: PascalCase with 'Context' suffix - `AuthContext.tsx`
5. **Pages**: kebab-case for directories - `/app/level/[id]/page.tsx`
6. **Types**: PascalCase with descriptive names - `UserProfile.ts`, `LevelData.ts`
7. **Constants**: UPPER_SNAKE_CASE - `DEFAULT_LEVEL_COUNT.ts`

## Technical Stack

- **Frontend**: 
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components

- **Backend**:
  - Firebase
    - Authentication (email/password)
    - Firestore (database)
    - Storage (for artifacts)
    - Functions (optional)

- **Integrations**:
  - YouTube API for video content
  - OpenAI API for AI assistant chatbot

## Database Schema

The Firestore database consists of the following collections:

### 1. users
```
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string (optional)
  - businessInfo: {
      description: string,
      employees: number,
      revenue: string,
      goals: string[]
    }
  - createdAt: timestamp
  - lastLogin: timestamp
  - role: 'user' | 'admin'
```

### 2. userProgress
```
userProgress/{userId}
  - completedLevels: string[]
  - currentLevel: string
  - skillProgress: {
      personalSkills: number,   // Личные навыки и развитие
      management: number,       // Управление и планирование
      networking: number,       // Нетворкинг и связи
      clientWork: number,       // Работа с клиентами и продажи
      finance: number,          // Финансовое управление
      legal: number             // Бухгалтерские и юр-е вопросы
    }
  - badges: {
      id: string,
      name: string,
      description: string,
      achieved: boolean,
      achievedAt: timestamp
    }[]
  - downloadedArtifacts: string[]
  - watchedVideos: string[]
  - completedTests: string[]
```

### 3. levels
```
levels/{levelId}
  - order: number
  - title: string
  - description: string
  - isLocked: boolean
  - isPremium: boolean
  - skillsFocus: string[]
  - videos: {
      id: string,
      title: string,
      description: string,
      youtubeId: string,
      duration: number,
      order: number
    }[]
  - tests: {
      id: string,
      afterVideoId: string,
      questions: {
        id: string,
        text: string,
        options: string[],
        correctAnswer: number
      }[]
    }[]
  - artifacts: {
      id: string,
      title: string,
      description: string,
      fileUrl: string,
      fileType: string
    }[]
```

### 4. artifacts
```
artifacts/{artifactId}
  - title: string
  - description: string
  - fileUrl: string
  - fileType: 'pdf' | 'doc' | 'spreadsheet'
  - levelId: string
  - downloadCount: number
```

### 5. chatHistory
```
chatHistory/{userId}/messages/{messageId}
  - text: string
  - sender: 'user' | 'bot'
  - timestamp: timestamp
```

## Application Structure

The application follows a modular structure with clear separation of concerns:

```
/app
  /api - API routes for serverless functions
    /auth - Authentication API endpoints
    /levels - Level management endpoints
    /progress - Progress tracking endpoints
    /chat - Chat API integration
  /auth - Authentication pages
    /login/page.tsx - Login page
    /register/page.tsx - Registration page
    /reset-password/page.tsx - Password reset page
  /(routes) - Main application routes
    /map/page.tsx - Level map page
    /level/[id]/page.tsx - Individual level page
    /profile/page.tsx - User profile page
    /artifacts/page.tsx - Artifacts listing page
    /chat/page.tsx - Chat interface page
    /settings/page.tsx - User settings page
    /faq/page.tsx - FAQ page
/components
  /ui - shadcn UI components (follow shadcn/ui pattern)
  /layout - Layout components
    /MainLayout.tsx - Main application layout with sidebar
    /AuthLayout.tsx - Authentication pages layout
  /features - Feature-specific components (each in its own directory)
    /level-map
      /LevelMap.tsx - Main level map component
      /LevelCard.tsx - Individual level card component
      /LevelConnection.tsx - Visual connection between levels
    /video-player
      /VideoPlayer.tsx - YouTube video player component
      /VideoProgress.tsx - Video progress tracking component
    /tests
      /TestContainer.tsx - Test wrapper component
      /QuestionCard.tsx - Individual question component
      /ResultDisplay.tsx - Test results component
    /artifacts
      /ArtifactCard.tsx - Artifact display component
      /DownloadButton.tsx - Artifact download button with tracking
    /profile
      /ProfileCard.tsx - User profile information component
      /SkillProgressBar.tsx - Skill visualization component
      /BadgeDisplay.tsx - User badges component
    /chat
      /ChatInterface.tsx - Chat UI component
      /MessageBubble.tsx - Individual message component
/lib - Utility functions and Firebase setup
  /firebase
    /config.ts - Firebase configuration
    /auth.ts - Firebase authentication utilities
    /firestore.ts - Firestore utilities
    /storage.ts - Firebase storage utilities
  /utils
    /date-utils.ts - Date formatting and manipulation
    /progress-utils.ts - Progress calculation utilities
/hooks - Custom React hooks (one hook per file)
  /useAuth.ts - Authentication state hook
  /useLevels.ts - Levels data hook
  /useProgress.ts - User progress hook
  /useArtifacts.ts - Artifacts management hook
  /useChat.ts - Chat functionality hook
/context - Context providers
  /AuthContext.tsx - Authentication context
  /ProgressContext.tsx - User progress context
  /UIContext.tsx - UI state context
/types - TypeScript type definitions
  /User.ts - User-related types
  /Level.ts - Level-related types  
  /Progress.ts - Progress tracking types
  /Artifact.ts - Artifact-related types
  /Chat.ts - Chat-related types
/public - Static assets
  /images - Image assets
  /icons - Icon assets
```

> **Note**: Keep each file focused on a single responsibility and under 300 lines whenever possible to help Cursor maintain context.

## Page Routes

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/reset-password` - Password reset page
- `/map` - Levels overview (main navigation)
- `/level/[id]` - Individual level with videos and tests
- `/profile` - User profile and progress
- `/artifacts` - All downloadable resources
- `/chat` - AI assistant interface
- `/settings` - Account settings
- `/faq` - Frequently asked questions

## Core Components

### 1. Layout Components
- **MainLayout**: Sidebar navigation, header (used across main application)
- **AuthLayout**: Simplified layout for authentication pages

### 2. Feature Components
- **LevelMap**: Gamified path visualization (10 levels with status indicators)
- **VideoPlayer**: YouTube embedded player with tracking
- **TestComponent**: Interactive quiz system
- **ArtifactCard**: Downloadable resource card with tracking
- **SkillProgressBar**: Visualization of 6 skill categories
- **ChatInterface**: AI assistant messaging system
- **ProfileCard**: User info and progress summary
- **BadgeDisplay**: Achievement visualization

## Authentication Flow

1. **Registration**:
   - User submits email/password
   - Create user in Firebase Auth
   - Initialize user document in Firestore
   - Create empty progress record
   - Redirect to Map

2. **Login**:
   - Authenticate with Firebase
   - Fetch user data and progress
   - Update last login timestamp
   - Redirect to Map or last viewed level

## Level Progression System

1. Each level contains:
   - 3-4 short videos (2-4 minutes each)
   - Tests or mini-assignments after videos
   - At least one downloadable artifact
   - Completion button

2. Level status can be:
   - Locked (not available)
   - Available (unlocked)
   - Completed (finished)

3. Unlocking mechanism:
   - Level 1 is available by default
   - Other levels unlock when previous level is completed
   - Completion requires watching videos and downloading artifact
   - User must click "Complete Level" button

## Visual Design

- **Primary color**: #00BFA6 (teal)
- **Secondary color**: Light grays, whites
- **Font**: System fonts (Tailwind defaults)
- **Layout**: Sidebar navigation + main content area
- **Mobile responsive**: Both web and mobile versions

## Implementation Notes

1. **Video Integration**:
   - YouTube embedded player (not direct API yet)
   - Track video views in Firestore

2. **Artifacts System**:
   - Store files in Firebase Storage
   - Track downloads in Firestore
   - PDF, spreadsheets, and document formats

3. **AI Chat**:
   - Integrate with OpenAI API
   - Store conversation history in Firestore
   - Provide context-aware assistance

4. **Progress Tracking**:
   - Update userProgress after each action
   - Calculate skill progress based on completed levels
   - Award badges for achievements

## UI Reference

The application follows design patterns shown in the provided screenshots:

1. **Level Map**: Gamified path with locked/unlocked levels, connected by lines
   - Green level cards for completed levels
   - White level cards for available levels
   - Gray level cards with lock icon for locked levels
   - Horizontal and vertical connections between levels
   - User avatar and level indicator in top right

2. **Profile Page**: User info, business details, skill progress bars, badges
   - User name and status at top
   - Business information section with completion prompt
   - Six skill categories with progress bars (colored/gray dots)
   - Overall progress indicator (X of 10 levels)
   - Achievement badges display
   - Personal information section

3. **Level Page**: Video player, artifact download, complete level button
   - "Return to Map" navigation link
   - Progress indicator for current level (segments)
   - Video player area with title
   - Artifact download section
   - "Ask AI Assistant" button
   - "Complete Level" button (yellow)

4. **Settings Page**: Account management, preferences, notifications
   - "Settings & Preferences" page title
   - Account information section with editable fields
   - Change password button
   - Edit button for account information
   - Preferences section with language dropdown
   - Notification toggles (Email, In-app, Dark Mode)

5. **Chat Page**: AI assistant interaction, message history
   - Chat type tabs (Group Chat, Tracker Chat, AI-Bot Chat)
   - Message history with user/bot distinction
   - Message input field with send button
   - Chat bubbles with clear visual distinction between user/bot

6. **Artifacts Page**: List of downloadable resources
   - Artifact cards with icons indicating file type
   - Download buttons for each artifact
   - "Go to Related Lesson" links
   - Brief description of each artifact
   - Helper text at bottom for additional resources

## Component Relationships

Here's a diagram of the main component relationships:

```
MainLayout
├── SideNavigation
├── PageContent
│   ├── LevelMapPage
│   │   └── LevelMap
│   │       ├── LevelCard
│   │       └── LevelConnection
│   ├── LevelDetailPage
│   │   ├── VideoPlayer
│   │   ├── TestComponent
│   │   │   ├── QuestionCard
│   │   │   └── ResultDisplay
│   │   └── ArtifactDownload
│   ├── ProfilePage
│   │   ├── ProfileInfo
│   │   ├── BusinessInfo
│   │   ├── SkillProgress
│   │   │   └── ProgressBar (x6)
│   │   └── BadgeDisplay
│   ├── ArtifactsPage
│   │   └── ArtifactCard (multiple)
│   ├── ChatPage
│   │   ├── ChatTabs
│   │   ├── MessageList
│   │   │   └── MessageBubble
│   │   └── MessageInput
│   └── SettingsPage
│       ├── AccountSettings
│       ├── PreferencesSettings
│       └── NotificationSettings
└── StatusBar
```

## Development Approach

### Component-First Development

For each feature, we'll follow this development sequence:
1. **Define Types**: Create TypeScript types for the feature
2. **Create UI Components**: Build and test UI components in isolation
3. **Implement Hooks**: Develop data fetching and state management hooks
4. **Connect Components**: Connect components with hooks and context
5. **Add Page Integration**: Integrate into page layout and routing
6. **Test End-to-End**: Test the complete feature flow

### Error Handling Strategy

Implement consistent error handling:
1. **API Errors**: Capture in try/catch blocks with standardized error responses
2. **UI Error States**: Show appropriate error messages and recovery options
3. **Error Boundaries**: Implement React error boundaries for component failures
4. **Logging**: Log errors for debugging but keep sensitive information secure

### Testing Approach

For each component and feature:
1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **User Flow Tests**: Test complete user journeys

### Development Priority

1. Authentication system
   - User registration
   - Login
   - Password recovery
   - Protected routes

2. Level map navigation
   - Level map visualization
   - Level status indication
   - Level selection

3. Level content display
   - Video playback
   - Test/quiz implementation
   - Artifact downloads
   - Level completion

4. Profile and progress tracking
   - User profile display
   - Skill progression visualization
   - Badge system

5. Artifacts system
   - Artifact listing
   - Download tracking
   - Organization by categories

6. Chat integration
   - Chat interface
   - OpenAI integration
   - Context-aware assistance

7. Settings and user preferences
   - Account management
   - Notification preferences
   - Theme settings
