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