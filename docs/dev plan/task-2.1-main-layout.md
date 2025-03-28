# Task 2.1: Implement Main Layout

## Task Details

```
Task: Create the main application layout with navigation
Reference: Core Components and UI Reference sections in project description
Context: We need a consistent layout for the application pages
Current Files:
- /hooks/useAuth.ts (Auth hooks)
- /components/layout/ProtectedRoute.tsx (Route protection)
Previous Decision: Use sidebar navigation similar to UI reference images
```

## Context Recovery Steps

1. Review the project description document, particularly the Core Components and UI Reference sections:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the project structure:
   ```bash
   find ./components -type f | sort
   ```

4. Review the authentication hook for user information:
   ```bash
   cat hooks/useAuth.ts
   ```

## Implementation Steps

```
1. Create `/components/layout/MainLayout.tsx`:

```typescript
/**
 * @file MainLayout.tsx
 * @description Main application layout with sidebar navigation
 * @dependencies hooks/useAuth, components/layout/Sidebar
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout component
 * 
 * Main layout for authenticated pages with sidebar navigation
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

2. Create `/components/layout/Sidebar.tsx`:

```typescript
/**
 * @file Sidebar.tsx
 * @description Sidebar navigation component
 * @dependencies hooks/useAuth
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Map, 
  User, 
  FileText, 
  MessageCircle, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Sidebar component
 * 
 * Navigation sidebar for the application
 */
export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Create navigation items
  const navItems: NavItem[] = [
    {
      href: '/map',
      label: 'Карта Уровней',
      icon: <Map className="w-5 h-5" />,
    },
    {
      href: '/profile',
      label: 'Профиль',
      icon: <User className="w-5 h-5" />,
    },
    {
      href: '/artifacts',
      label: 'Артефакты',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: '/chat',
      label: 'Чат',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      href: '/settings',
      label: 'Настройки',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      href: '/faq',
      label: 'Частые Вопросы',
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.displayName) return 'U';
    
    const nameParts = user.displayName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/map" className="text-2xl font-bold text-teal-500">
          BizLevel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-teal-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-teal-100 text-teal-800">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
```

3. Create `/components/ui/avatar.tsx` with shadcn/ui avatar component:

```
npx shadcn-ui@latest add avatar
```

4. Create layout wrapper for main pages at `/app/(main)/layout.tsx`:

```typescript
/**
 * @file layout.tsx
 * @description Main application layout wrapper
 * @dependencies components/layout/MainLayout
 */

import { MainLayout } from '@/components/layout/MainLayout';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
```

5. Create a simple placeholder page at `/app/(main)/map/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Map page (placeholder)
 */

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Карта Уровней</h1>
      <p>This is a placeholder for the level map page.</p>
    </div>
  );
}
```

6. Create a placeholder for other main pages:

Create these placeholder files:
- `/app/(main)/profile/page.tsx`
- `/app/(main)/artifacts/page.tsx`
- `/app/(main)/chat/page.tsx`
- `/app/(main)/settings/page.tsx`
- `/app/(main)/faq/page.tsx`

For each file, use this basic structure (changing the title accordingly):

```typescript
/**
 * @file page.tsx
 * @description [Page Name] page (placeholder)
 */

export default function [PageName]Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">[Page Title]</h1>
      <p>This is a placeholder for the [page name] page.</p>
    </div>
  );
}
```

7. Update root page at `/app/page.tsx` to redirect to the map page:

```typescript
/**
 * @file page.tsx
 * @description Root page - redirects to map page
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/map');
}
```

## Expected Output

```
- Complete layout components:
  - /components/layout/MainLayout.tsx
  - /components/layout/Sidebar.tsx
  - /app/(main)/layout.tsx
- Placeholder pages:
  - /app/(main)/map/page.tsx
  - /app/(main)/profile/page.tsx
  - /app/(main)/artifacts/page.tsx
  - /app/(main)/chat/page.tsx
  - /app/(main)/settings/page.tsx
  - /app/(main)/faq/page.tsx
- Updated root page:
  - /app/page.tsx
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Core layout and navigation

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout

   ## Current Issues
   - None

   ## Next Up
   - Task 2.2: Build Level Map Component

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: In Progress (Layout implemented, map component next)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/layout.md` with a description of the layout system:
   ```markdown
   # Layout System

   ## Overview
   This document describes the layout system used throughout the BizLevel application.

   ## Layout Components

   ### 1. MainLayout
   - Container for all authenticated pages
   - Includes sidebar navigation
   - Wraps content in a protected route
   - Responsive design for desktop and mobile

   ### 2. Sidebar
   - Navigation menu for the application
   - Shows user profile information
   - Highlights the current active route
   - Provides links to all main sections

   ### 3. AuthLayout
   - Simplified layout for authentication pages
   - Centered card design
   - Logo and branding

   ## Route Structure

   ### Public Routes
   - `/auth/login`
   - `/auth/register`
   - `/auth/reset-password`

   ### Protected Routes (using MainLayout)
   - `/map` - Level map navigation
   - `/level/[id]` - Individual level pages
   - `/profile` - User profile
   - `/artifacts` - Artifacts listing
   - `/chat` - Chat interface
   - `/settings` - User settings
   - `/faq` - Frequently asked questions

   ## Navigation Logic
   - Root page (`/`) redirects to map page
   - Authenticated users are directed to the map page
   - Unauthenticated users attempting to access protected routes are redirected to login
   - Current route is highlighted in the sidebar

   ## Implementation Details
   - Next.js App Router for routing
   - Client components for interactive elements
   - Protected routes using authentication context
   - Responsive design using Tailwind CSS
   ```

## Testing Instructions

1. Test layout and navigation:
   - Run the development server
   - Navigate to the root URL and verify redirect to map page
   - Check that the layout appears correctly with sidebar
   - Test all navigation links in the sidebar
   - Verify that the current route is highlighted

2. Test responsive design:
   - Check layout on different screen sizes
   - Verify that sidebar and content are usable on mobile

3. Test authentication integration:
   - Verify that protected routes redirect to login when not authenticated
   - Log in and confirm that protected routes are accessible
   - Check that user information appears in the sidebar

4. Test route changes:
   - Verify that navigation between routes works correctly
   - Check that the active state in sidebar updates with route changes
