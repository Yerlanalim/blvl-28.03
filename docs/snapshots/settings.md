# Settings System Snapshot

## Purpose
Allow users to manage account settings, preferences, and notifications

## Key Files
- `/hooks/useSettings.ts` - Hook for settings management
- `/components/features/settings/AccountSection.tsx` - Account settings component
- `/components/features/settings/PreferencesSection.tsx` - Preferences settings component
- `/components/features/settings/NotificationsSection.tsx` - Notification settings component
- `/components/features/settings/PasswordChangeModal.tsx` - Password change modal
- `/app/(routes)/settings/page.tsx` - Settings page

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