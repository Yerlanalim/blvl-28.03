# Settings System

## Overview
This document describes the settings system, which allows users to manage their account information, preferences, and notification settings.

## Components

### 1. AccountSection
- Displays user account information (email, username)
- Provides edit functionality for account details
- Includes button to trigger password change
- Visually organizes information with icons

### 2. PreferencesSection
- Controls for user preferences
- Language selection dropdown
- Uses shadcn/ui Select component for clean UI

### 3. NotificationsSection
- Toggle switches for notification preferences
- Email notification settings
- In-app notification settings
- Dark mode toggle
- Uses shadcn/ui Switch component

### 4. PasswordChangeModal
- Modal dialog for changing user password
- Current password verification
- New password and confirmation fields
- Password visibility toggles
- Validation and error handling
- Uses shadcn/ui Dialog component

## Data Management

### useSettings Hook
- Manages user settings and preferences
- Loads saved preferences (from localStorage in MVP)
- Provides functions for updating preferences
- Handles password change requests
- Manages loading, saving, and success states
- Provides error handling

## User Preferences

### Stored Preferences
- Language preference (English/Russian)
- Email notification opt-in
- In-app notification opt-in
- Dark mode toggle

### Account Settings
- Email address
- Username
- Password (change functionality)

## Implementation Details
- React components with TypeScript
- Local storage for preferences in MVP (will use Firestore in production)
- Form validation for password changes
- Success and error feedback with alert components
- Saving indicators during async operations 