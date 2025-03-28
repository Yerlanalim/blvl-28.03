# Task 1.5: Build Authentication Pages

## Task Details

```
Task: Create login, registration, and password reset pages
Reference: Authentication Flow and Page Routes sections in project description
Context: Users need to authenticate before accessing the platform
Current Files:
- /context/AuthContext.tsx (Auth context)
- /hooks/useAuth.ts (Auth hooks)
- /lib/firebase/auth.ts (Firebase auth)
- /types/User.ts (User types)
Previous Decision: Use React Hook Form for form management
```

## Context Recovery Steps

1. Review the project description document, particularly the Authentication Flow and Page Routes sections:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the authentication context and hooks:
   ```bash
   cat context/AuthContext.tsx
   cat hooks/useAuth.ts
   ```

4. Review the User type definitions:
   ```bash
   cat types/User.ts
   ```

## Implementation Steps

```
1. Create the authentication layout at `/app/auth/layout.tsx`:

```typescript
/**
 * @file layout.tsx
 * @description Authentication pages layout
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Authentication - BizLevel',
  description: 'Sign in or register for BizLevel',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="text-3xl font-bold text-teal-500">BizLevel</div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
```

2. Create shared UI components for auth forms:

First, create `/components/features/auth/AuthCard.tsx`:
```typescript
/**
 * @file AuthCard.tsx
 * @description Card component for authentication forms
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * AuthCard component
 * 
 * Card container for authentication forms
 */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        {description && <CardDescription className="text-center">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
```

Next, create `/components/features/auth/FormError.tsx`:
```typescript
/**
 * @file FormError.tsx
 * @description Error display component for forms
 */

import React from 'react';

interface FormErrorProps {
  message?: string;
}

/**
 * FormError component
 * 
 * Displays an error message for forms
 */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-2 text-sm" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
```

3. Create login page at `/app/auth/login/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Login page
 * @dependencies hooks/useAuth, components/features/auth/*
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/features/auth/AuthCard';
import { FormError } from '@/components/features/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Type for form values
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/map';
  
  // Form error state
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      await signIn({
        email: data.email,
        password: data.password,
      });
      
      // Get stored redirect path or use default
      const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
      const redirectPath = storedRedirect || redirectTo;
      
      // Clear stored redirect
      if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
      }
      
      // Redirect after successful login
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setFormError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };
  
  // Extract error message from various error types
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred. Please try again.';
  };
  
  return (
    <AuthCard
      title="Sign in to your account"
      description="Enter your credentials to access your account"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-teal-600 hover:text-teal-500">
              Register
            </Link>
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              Forgot password?
            </Link>
          </div>
          
          {formError && <FormError message={formError} />}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
```

4. Create registration page at `/app/auth/register/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Registration page
 * @dependencies hooks/useAuth, components/features/auth/*
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/features/auth/AuthCard';
import { FormError } from '@/components/features/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessInfo } from '@/types';

// Form validation schema
const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  businessDescription: z.string().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  businessGoals: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type for form values
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  
  // Form error state
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessDescription: '',
      employees: '',
      revenue: '',
      businessGoals: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Process business info
      const businessInfo: BusinessInfo = {
        description: data.businessDescription || '',
        employees: parseInt(data.employees || '0') || 0,
        revenue: data.revenue || '',
        goals: data.businessGoals ? data.businessGoals.split(',').map(g => g.trim()) : [],
      };
      
      await signUp({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        businessInfo: businessInfo,
      });
      
      // Redirect to map after successful registration
      router.push('/map');
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };
  
  // Extract error message from various error types
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred. Please try again.';
  };
  
  return (
    <AuthCard
      title="Create your account"
      description="Register to access the BizLevel platform"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <h3 className="text-md font-medium mb-2">Business Information (Optional)</h3>
            
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe your business" 
                      className="resize-none"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. $100k - $500k" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Business Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your goals, separated by commas" 
                      className="resize-none"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your key business goals, separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {formError && <FormError message={formError} />}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
```

5. Create password reset page at `/app/auth/reset-password/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Password reset page
 * @dependencies hooks/useAuth, components/features/auth/*
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/features/auth/AuthCard';
import { FormError } from '@/components/features/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Type for form values
type ResetPasswordFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  
  // Form states
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      await resetPassword({
        email: data.email,
      });
      
      // Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Extract error message from various error types
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred. Please try again.';
  };
  
  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email to receive a password reset link"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <p className="block sm:inline">
            Password reset email sent! Check your inbox for instructions.
          </p>
          <div className="mt-4">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      {...field} 
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {formError && <FormError message={formError} />}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
      )}
    </AuthCard>
  );
}
```

## Expected Output

```
- Complete authentication pages with forms and validation:
  - /app/auth/layout.tsx - Shared layout for auth pages
  - /components/features/auth/AuthCard.tsx - Card component for auth forms
  - /components/features/auth/FormError.tsx - Error display component
  - /app/auth/login/page.tsx - Login page
  - /app/auth/register/page.tsx - Registration page
  - /app/auth/reset-password/page.tsx - Password reset page
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Authentication system completion

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages

   ## Current Issues
   - None

   ## Next Up
   - Task 2.1: Implement Main Layout

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Not Started (Type definitions created)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started
   ```

2. Update `/docs/features/authentication.md` to include the authentication pages:
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

   ## Screenshots
   [To be added when available]
   ```

3. Create a snapshot document at `/docs/snapshots/authentication.md`:
   ```markdown
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
   ```

## Testing Instructions

1. Test the login page:
   - Navigate to `/auth/login`
   - Try submitting without entering data
   - Enter invalid email/password
   - Enter valid credentials and verify redirect

2. Test the registration page:
   - Navigate to `/auth/register`
   - Try submitting without entering data
   - Test password mismatch validation
   - Complete the form and verify account creation

3. Test the password reset page:
   - Navigate to `/auth/reset-password`
   - Enter an email and verify success message
   - Check for email delivery (if using a real Firebase project)

4. Test protected routes:
   - Create a protected route using the `ProtectedRoute` component
   - Verify redirect to login when not authenticated
   - Verify access when authenticated

5. Verify responsive design:
   - Test all auth pages on mobile viewport sizes
   - Ensure forms are usable on small screens
