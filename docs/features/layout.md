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