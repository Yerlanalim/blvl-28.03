# Task 1.4: Create Authentication Context and Hooks

## Task Details

```
Task: Implement authentication context for user management
Reference: Authentication Flow section in project description
Context: We need to manage user authentication state throughout the app
Current Files:
- /lib/firebase/auth.ts (Firebase auth utilities)
- /types/User.ts (User type definitions)
Previous Decision: Use React Context for auth state management
```

## Context Recovery Steps

1. Review the project description document, particularly the Authentication Flow section:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Firebase auth utilities:
   ```bash
   cat lib/firebase/auth.ts
   ```

4. Review the User type definitions:
   ```bash
   cat types/User.ts
   ```

## Implementation Steps

```
1. Create `/context/AuthContext.tsx`:

```typescript
/**
 * @file AuthContext.tsx
 * @description Authentication context provider
 * @dependencies firebase/auth, types/User
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, LoginFormData, RegisterFormData, ResetPasswordFormData } from '@/types';
import { 
  onAuthStateChange, 
  getUserData, 
  signIn as firebaseSignIn, 
  signOut as firebaseSignOut,
  createUser as firebaseCreateUser,
  resetPassword as firebaseResetPassword
} from '@/lib/firebase/auth';

// Auth state interface
interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  signIn: (data: LoginFormData) => Promise<void>;
  signUp: (data: RegisterFormData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordFormData) => Promise<void>;
}

// Default context state
const defaultContextState: AuthContextType = {
  user: null,
  firebaseUser: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {}
};

// Create the auth context
export const AuthContext = createContext<AuthContextType>(defaultContextState);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * 
 * Manages authentication state and provides auth methods to the app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for the auth context
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  // Fetch user data from Firestore based on Firebase user
  const fetchUserData = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const userData = await getUserData(firebaseUser.uid);
      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setState(prev => ({ ...prev, firebaseUser }));
        await fetchUserData(firebaseUser);
      } else {
        setState({
          user: null,
          firebaseUser: null,
          isLoading: false,
          isAuthenticated: false,
          error: null
        });
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, [fetchUserData]);

  // Sign in function
  const signIn = async (data: LoginFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await firebaseSignIn(data);
      // Auth state listener will update the user state
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
      throw error;
    }
  };

  // Sign up function
  const signUp = async (data: RegisterFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await firebaseCreateUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: 'user',
        businessInfo: data.businessInfo
      });
      // Auth state listener will update the user state
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await firebaseSignOut();
      // Auth state listener will update the user state
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (data: ResetPasswordFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await firebaseResetPassword(data);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Reset password error:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
      throw error;
    }
  };

  // Combined context value
  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

2. Create `/hooks/useAuth.ts`:

```typescript
/**
 * @file useAuth.ts
 * @description Custom hook for authentication
 * @dependencies context/AuthContext
 */

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Custom hook to access authentication context
 * 
 * @returns Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
```

3. Create `/app/providers.tsx`:

```typescript
/**
 * @file providers.tsx
 * @description Application providers wrapper
 * @dependencies context/AuthContext
 */

'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component
 * 
 * Wraps the application with all necessary providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

4. Update `/app/layout.tsx`:

```typescript
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BizLevel - Business Skills Learning Platform',
  description: 'Improve your business skills through short videos, interactive tests, and practical tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

5. Create `/components/layout/ProtectedRoute.tsx`:

```typescript
/**
 * @file ProtectedRoute.tsx
 * @description Component to protect routes that require authentication
 * @dependencies hooks/useAuth
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * 
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Store current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
};
```

## Expected Output

```
- Complete authentication system with context and hooks:
  - /context/AuthContext.tsx
  - /hooks/useAuth.ts
  - /app/providers.tsx
  - /app/layout.tsx (updated)
  - /components/layout/ProtectedRoute.tsx
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Authentication system implementation

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks

   ## Current Issues
   - None

   ## Next Up
   - Task 1.5: Build Authentication Pages

   ## Component Status
   - Authentication: In Progress (Context and hooks created)
   - Level Map: Not Started (Type definitions created)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started
   ```

2. Create `/docs/features/authentication.md` with a description of the authentication system:
   ```markdown
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
   ```

## Testing Instructions

1. Verify the authentication context and hooks are working:
   - Create a test component that uses the `useAuth` hook
   - Check that the hook returns the expected values
   - Verify that the auth state changes when a user signs in or out

2. Test TypeScript integration:
   ```bash
   npx tsc --noEmit
   ```

3. Test the `ProtectedRoute` component:
   - Create a protected route in the application
   - Verify that unauthenticated users are redirected to the login page
   - Verify that authenticated users can access the protected route
