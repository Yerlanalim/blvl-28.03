начать с этой, удалить эту надпись  

# Task 3.3: Implement Settings Page

## Task Details

```
Task: Create settings page for user preferences
Reference: UI Reference (Image 2) in project description
Context: Users need to manage their account settings
Current Files:
- /types/User.ts (User type definitions)
- /hooks/useAuth.ts (Authentication hook)
- /app/(main)/settings/page.tsx (Settings page placeholder)
Previous Decision: Follow the UI design in Image 2 with account settings, preferences, and notifications
```

## Context Recovery Steps

1. Review the project description document, particularly the Settings Page section in UI Reference:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the User type definitions:
   ```bash
   cat types/User.ts
   ```

4. Review the authentication hook:
   ```bash
   cat hooks/useAuth.ts
   ```

## Implementation Steps

```
1. Create `/hooks/useSettings.ts` for managing user settings:

```typescript
/**
 * @file useSettings.ts
 * @description Hook for managing user settings and preferences
 * @dependencies hooks/useAuth
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// User preferences type
export interface UserPreferences {
  language: 'english' | 'russian';
  emailNotifications: boolean;
  appNotifications: boolean;
  darkMode: boolean;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'english',
  emailNotifications: true,
  appNotifications: true,
  darkMode: false
};

/**
 * Hook for managing user settings and preferences
 */
export function useSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // In a real app, we'd fetch from Firestore
      // For MVP, we'll use mock data (localStorage for persistence)
      const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
      
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError(err instanceof Error ? err : new Error('Failed to load preferences'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      setIsSuccess(false);
      
      // Update local state
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };
      
      setPreferences(updatedPreferences);
      
      // In a real app, we'd save to Firestore
      // For MVP, we'll use localStorage
      localStorage.setItem(
        `preferences_${user.id}`, 
        JSON.stringify(updatedPreferences)
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSaving(false);
      setIsSuccess(true);
      
      // Reset success status after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err instanceof Error ? err : new Error('Failed to save preferences'));
      setIsSaving(false);
    }
  }, [user, preferences]);

  /**
   * Change user password
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      setIsSuccess(false);
      
      // In a real app, we'd call Firebase Auth
      // For MVP, we'll simulate API call
      console.log('Changing password:', { currentPassword, newPassword });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaving(false);
      setIsSuccess(true);
      
      // Reset success status after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
      
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err : new Error('Failed to change password'));
      setIsSaving(false);
      return false;
    }
  }, [user]);

  return {
    preferences,
    loading,
    error,
    isSaving,
    isSuccess,
    updatePreferences,
    changePassword
  };
}
```

2. Create `/components/features/settings/AccountSection.tsx`:

```typescript
/**
 * @file AccountSection.tsx
 * @description Component for displaying and editing account information
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { MailIcon, UserIcon, KeyIcon } from 'lucide-react';

interface AccountSectionProps {
  onPasswordChangeClick: () => void;
}

/**
 * AccountSection component
 * 
 * Displays and allows editing of account information
 */
export function AccountSection({ onPasswordChangeClick }: AccountSectionProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // In a real app, we would save these changes to Firebase Auth
  const handleSave = () => {
    console.log('Saving account info:', { username, email });
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Email field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Username field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Password field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="password"
                value="••••••••"
                disabled={true}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row sm:justify-between gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="outline" onClick={onPasswordChangeClick}>
                  Change Password
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

3. Create `/components/features/settings/PreferencesSection.tsx`:

```typescript
/**
 * @file PreferencesSection.tsx
 * @description Component for managing user preferences
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences } from '@/hooks/useSettings';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: keyof UserPreferences, value: any) => void;
  isLoading?: boolean;
}

/**
 * PreferencesSection component
 * 
 * Displays and allows editing of user preferences
 */
export function PreferencesSection({ 
  preferences, 
  onPreferenceChange,
  isLoading = false
}: PreferencesSectionProps) {
  // Handle language change
  const handleLanguageChange = (value: string) => {
    onPreferenceChange('language', value as 'english' | 'russian');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Language</label>
          <Select
            disabled={isLoading}
            value={preferences.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="russian">Russian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
```

4. Create `/components/features/settings/NotificationsSection.tsx`:

```typescript
/**
 * @file NotificationsSection.tsx
 * @description Component for managing notification preferences
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/hooks/useSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationsSectionProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: keyof UserPreferences, value: any) => void;
  isLoading?: boolean;
}

/**
 * NotificationsSection component
 * 
 * Displays and allows toggling of notification settings
 */
export function NotificationsSection({ 
  preferences, 
  onPreferenceChange,
  isLoading = false
}: NotificationsSectionProps) {
  // Handle toggle change
  const handleToggleChange = (key: keyof UserPreferences) => {
    onPreferenceChange(key, !preferences[key]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <div className="text-sm text-gray-500">
              Receive notifications about your progress via email
            </div>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={() => handleToggleChange('emailNotifications')}
            disabled={isLoading}
          />
        </div>
        
        {/* In-app Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">In-app Notifications</Label>
            <div className="text-sm text-gray-500">
              Receive notifications within the application
            </div>
          </div>
          <Switch
            checked={preferences.appNotifications}
            onCheckedChange={() => handleToggleChange('appNotifications')}
            disabled={isLoading}
          />
        </div>
        
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Dark Mode</Label>
            <div className="text-sm text-gray-500">
              Switch between light and dark theme
            </div>
          </div>
          <Switch
            checked={preferences.darkMode}
            onCheckedChange={() => handleToggleChange('darkMode')}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

5. Create `/components/features/settings/PasswordChangeModal.tsx`:

```typescript
/**
 * @file PasswordChangeModal.tsx
 * @description Modal for changing user password
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

/**
 * PasswordChangeModal component
 * 
 * Modal dialog for changing user password
 */
export function PasswordChangeModal({ 
  isOpen, 
  onClose, 
  onPasswordChange,
  isLoading
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Validate form
  const isValid = 
    currentPassword.length >= 6 && 
    newPassword.length >= 6 && 
    newPassword === confirmPassword;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
      } else if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
      }
      return;
    }
    
    setError(null);
    
    try {
      const success = await onPasswordChange(currentPassword, newPassword);
      
      if (success) {
        // Reset form and close modal
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        setError('Failed to change password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Current password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isLoading}
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

6. Create required shadcn/ui components:

```
npx shadcn-ui@latest add select
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
```

7. Update `/app/(main)/settings/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Settings page for managing user preferences
 * @dependencies hooks/useSettings, components/features/settings/*
 */

'use client';

import React, { useState } from 'react';
import { useSettings, UserPreferences } from '@/hooks/useSettings';
import { AccountSection } from '@/components/features/settings/AccountSection';
import { PreferencesSection } from '@/components/features/settings/PreferencesSection';
import { NotificationsSection } from '@/components/features/settings/NotificationsSection';
import { PasswordChangeModal } from '@/components/features/settings/PasswordChangeModal';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SettingsPage() {
  const {
    preferences,
    loading,
    error,
    isSaving,
    isSuccess,
    updatePreferences,
    changePassword
  } = useSettings();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Handle preference change
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    updatePreferences({ [key]: value });
  };
  
  // Handle password change
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    return await changePassword(currentPassword, newPassword);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings &amp; Preferences</h1>
        <p className="text-gray-600 mt-1">Manage your account, notifications, and more.</p>
      </div>
      
      {/* Success or error alert */}
      {(isSuccess || error) && (
        <Alert variant={isSuccess ? "default" : "destructive"}>
          {isSuccess ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isSuccess ? 'Settings Updated' : 'Error'}
          </AlertTitle>
          <AlertDescription>
            {isSuccess 
              ? 'Your settings have been saved successfully.' 
              : `Failed to save settings: ${error?.message}`
            }
          </AlertDescription>
        </Alert>
      )}
      
      {/* Account settings */}
      <AccountSection 
        onPasswordChangeClick={() => setIsPasswordModalOpen(true)} 
      />
      
      {/* Preferences */}
      <PreferencesSection 
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        isLoading={isSaving}
      />
      
      {/* Notifications */}
      <NotificationsSection 
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        isLoading={isSaving}
      />
      
      {/* Password change modal */}
      <PasswordChangeModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChange={handlePasswordChange}
        isLoading={isSaving}
      />
    </div>
  );
}
```

8. Create the alert component:

```
npx shadcn-ui@latest add alert
```

## Expected Output

```
- Settings page files:
  - /hooks/useSettings.ts (Hook for settings management)
  - /components/features/settings/AccountSection.tsx (Account settings component)
  - /components/features/settings/PreferencesSection.tsx (Preferences settings component)
  - /components/features/settings/NotificationsSection.tsx (Notification settings component)
  - /components/features/settings/PasswordChangeModal.tsx (Password change modal)
  - /components/ui/select.tsx (Select component)
  - /components/ui/switch.tsx (Switch component)
  - /components/ui/label.tsx (Label component)
  - /components/ui/dialog.tsx (Dialog component)
  - /components/ui/alert.tsx (Alert component)
  - /app/(main)/settings/page.tsx (Updated settings page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Settings page implementation

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

   ## Current Issues
   - None

   ## Next Up
   - Task 3.4: Create FAQ Page

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Complete (Account settings, preferences, and notifications)
   - FAQ: Not Started (Type definitions created)
   ```

2. Create `/docs/features/settings.md` with a description of the settings system:
   ```markdown
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
   ```

3. Create a snapshot document at `/docs/snapshots/settings.md`:
   ```markdown
   # Settings System Snapshot

   ## Purpose
   Allow users to manage account settings, preferences, and notifications

   ## Key Files
   - `/hooks/useSettings.ts` - Hook for settings management
   - `/components/features/settings/AccountSection.tsx` - Account settings component
   - `/components/features/settings/PreferencesSection.tsx` - Preferences settings component
   - `/components/features/settings/NotificationsSection.tsx` - Notification settings component
   - `/components/features/settings/PasswordChangeModal.tsx` - Password change modal
   - `/app/(main)/settings/page.tsx` - Settings page

   ## State Management
   - User preferences stored in local state
   - Persistence via localStorage in MVP (will use Firestore in production)
   - Loading, saving, and success states for feedback
   - Modal open/close state for password change
   - Form validation state for password fields

   ## Data Flow
   1. useSettings hook loads saved preferences on mount
   2. User interacts with settings components
   3. Component calls preference update functions
   4. Hook saves changes and updates UI state
   5. Success or error feedback is displayed
   6. Changes persist between sessions

   ## Key Decisions
   - Modular settings sections for organization
   - Local storage for MVP to avoid Firebase dependency
   - Password visibility toggles for better UX
   - Consistent form validation across components
   - Modal dialog for password changes to focus user attention
   - Immediate feedback on setting changes

   ## Usage Example
   ```tsx
   import { useSettings } from '@/hooks/useSettings';
   import { NotificationsSection } from '@/components/features/settings/NotificationsSection';

   function NotificationsSettings() {
     const { preferences, isSaving, updatePreferences } = useSettings();
     
     const handlePreferenceChange = (key, value) => {
       updatePreferences({ [key]: value });
     };
     
     return (
       <NotificationsSection
         preferences={preferences}
         onPreferenceChange={handlePreferenceChange}
         isLoading={isSaving}
       />
     );
   }
   ```

   ## Known Issues
   - Dark mode toggle doesn't actually change theme (will be implemented later)
   - Password change is simulated in MVP
   - Account info editing doesn't update Firebase Auth
   ```

## Testing Instructions

1. Test the settings page:
   - Run the development server
   - Navigate to the settings page
   - Verify that all sections appear correctly (account, preferences, notifications)
   - Check that the form elements are interactive

2. Test account section:
   - Click "Edit" to enable editing mode
   - Change username and email
   - Save changes and verify they persist
   - Cancel changes and verify form resets

3. Test preferences section:
   - Change language selection
   - Verify that changes are saved and persist between refreshes

4. Test notifications section:
   - Toggle each switch (email notifications, in-app notifications, dark mode)
   - Verify that changes are saved and persist between refreshes

5. Test password change:
   - Click "Change Password" to open the modal
   - Test form validation (password too short, passwords don't match)
   - Test password visibility toggles
   - Submit with valid data and verify success feedback

6. Test responsive design:
   - Check the settings page on different screen sizes
   - Verify that the layout adjusts appropriately on mobile devices
   - Test the password modal on small screens
