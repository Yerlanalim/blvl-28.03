# Authentication System Snapshot

## Purpose
Authentication system for user sign-up, login, and password recovery

## Key Files
- `/context/AuthContext.tsx` - Authentication context provider
- `/hooks/useAuth.ts` - Custom hook for accessing auth context
- `/components/layout/ProtectedRoute.tsx` - Route protection component
- `/app/auth/layout.tsx` - Auth pages layout
- `/components/features/auth/AuthCard.tsx` - Card component for auth forms
- `/components/features/auth/FormError.tsx` - Error display component
- `/app/auth/login/page.tsx` - Login page
- `/app/auth/register/page.tsx` - Registration page
- `/app/auth/reset-password/page.tsx` - Password reset page

## State Management
- Authentication state is managed in `AuthContext`
- Form state is managed using React Hook Form
- Error state is managed locally in each form

## Data Flow
1. User submits credentials via form
2. Form data is validated with Zod
3. Auth functions from `useAuth` hook are called
4. Firebase processes authentication
5. Auth context is updated
6. User is redirected to appropriate page

## Key Decisions
- Using React Hook Form for form state management
- Using Zod for form validation
- Using Firebase Authentication for user management
- Storing user profile and progress in Firestore
- Creating shared components for auth forms

## Usage Example
```tsx
// Protected page example
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## Known Issues
- None at this time 