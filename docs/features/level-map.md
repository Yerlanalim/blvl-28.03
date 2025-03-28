# Level Map System

## Overview
This document describes the level map system, which is the main navigation interface for the BizLevel application.

## Components

### 1. LevelMap
- Main component that displays the gamified learning path
- Shows all levels with their status (locked, available, completed)
- Creates a visual path with connections between levels

### 2. LevelCard
- Individual card for each level
- Shows level number, title, and status
- Changes appearance based on status:
  - Completed: Green with checkmark
  - Available: White with title
  - Locked: Gray with lock icon

### 3. LevelConnection
- Visual connection between level cards
- Shows progression path between levels
- Changes appearance based on completion status

## Data Management

### Level Data
- Mock data in `/lib/data/levels.ts` for development
- Will be replaced with Firestore data in production
- Contains level information, videos, tests, and artifacts

### Progress Tracking
- Mock progress data in `/lib/data/user-progress.ts`
- Tracks completed levels, current level, and skill progress
- Used to determine level status and unlock logic

### useLevels Hook
- Custom hook for accessing level data and progress
- Provides helpers for checking level status
- Combines level data with user progress

## Level Progression Logic

### Unlocking Mechanism
- Level 1 is always available to all users
- Next level unlocks when the previous level is completed
- Level completion requires:
  - Watching all videos
  - Completing all tests
  - Downloading artifacts
  - Clicking "Complete Level" button

### Status Indicators
- Completed: User has finished all requirements
- Available: User can access the level
- Locked: User needs to complete previous levels

## Visual Design
- Gamified path layout similar to learning apps like Duolingo
- Connected levels showing progression
- Clear visual indicators for level status
- Responsive design for different screen sizes

## Implementation Details
- React components with TypeScript
- Tailwind CSS for styling
- useLevels hook for data management
- Card components from shadcn/ui 