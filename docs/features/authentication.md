# Authentication System

## Overview
This document describes the authentication system used in the BizLevel application.

## Implementation Components

### 1. Firebase Authentication
- Email/password authentication via Firebase
- User profile stored in Firestore
- Progress data initialized on user creation

### 2. Authentication Context
- `AuthContext` provides authentication state to the entire application
- Manages loading, authenticated, and error states
- Provides authentication functions (sign in, sign up, sign out, reset password)

### 3. Authentication Hook
- `useAuth` hook provides easy access to the authentication context
- Can be used in any client component

### 4. Protected Route Component
- `ProtectedRoute` component guards routes that require authentication
- Redirects to login if user is not authenticated
- Shows loading state while checking authentication

### 5. Authentication Pages
- **Shared Layout**: Common layout for all auth pages
- **Login Page**: Email/password authentication form
- **Registration Page**: User registration with business information
- **Password Reset Page**: Email-based password recovery

## User Flow
1. User navigates to login or registration page
2. User enters credentials
3. Form validates input
4. Firebase authenticates the user
5. Auth context updates
6. User is redirected to the main application

## Form Validation
- All forms use Zod for schema validation
- Real-time validation feedback
- Error handling for Firebase errors

## Authentication Flow
1. User enters credentials (email/password)
2. Firebase authenticates the user
3. `AuthContext` listens for authentication state changes
4. User data is fetched from Firestore
5. Authentication state is updated
6. Protected routes are accessible

## Usage

### Using the Auth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  // Use authentication state and functions
};
```

### Protecting Routes
```tsx
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

const ProtectedPage = () => {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
};
``` 