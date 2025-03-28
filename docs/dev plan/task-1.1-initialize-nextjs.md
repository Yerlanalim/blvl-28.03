# Task 1.1: Initialize Next.js Project

## Task Details

```
Task: Initialize Next.js project with required configuration
Reference: Technical Stack section in project description
Context: Starting the project from scratch
Current Files: None (new project)
Previous Decision: N/A
```

## Context Recovery Steps

1. Review the project description document:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

## Implementation Steps

```
1. Create a new Next.js project with app router:
   ```bash
   npx create-next-app@latest bizlevel --typescript --tailwind --eslint --app --use-npm
   cd bizlevel
   ```

2. Install required dependencies:
   ```bash
   npm install firebase @tanstack/react-query react-hook-form zod clsx class-variance-authority @hookform/resolvers axios
   ```

3. Install shadcn/ui and initial components:
   ```bash
   npx shadcn-ui@latest init
   # Accept the default settings when prompted
   npx shadcn-ui@latest add button card avatar input form toast
   ```

4. Set up environment variables:
   - Create `.env.local` file with Firebase config placeholders:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=placeholder
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=placeholder
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=placeholder
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=placeholder
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=placeholder
   NEXT_PUBLIC_FIREBASE_APP_ID=placeholder
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=placeholder
   
   # OpenAI API key for chat functionality (placeholder)
   OPENAI_API_KEY=placeholder
   ```
   
   - Add `.env.local` to `.gitignore`

5. Create the basic project structure by creating these directories:
   ```bash
   mkdir -p app/api app/auth app/level app/map app/profile app/artifacts app/chat app/settings app/faq
   mkdir -p components/ui components/layout components/features
   mkdir -p lib/firebase lib/utils
   mkdir -p hooks context types public/images public/icons
   mkdir -p docs/features docs/snapshots
   ```

6. Update the pages placeholders in the app directory:
   - Remove the default content from `/app/page.tsx` and replace with a placeholder home page
   - Add basic page files for main routes
```

## Expected Output

```
- Complete Next.js project structure
- Installed dependencies
- Basic directory structure
- Configuration files (.env.local, etc.)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Project initialization and setup

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui

   ## Current Issues
   - None

   ## Next Up
   - Task 1.2: Create TypeScript Type Definitions

   ## Component Status
   - Authentication: Not Started
   - Level Map: Not Started
   - Level Detail: Not Started
   - Profile: Not Started
   - Artifacts: Not Started
   - Chat: Not Started
   - Settings: Not Started
   ```

2. Update README.md with setup instructions

## Testing Instructions

1. Verify the Next.js project is created successfully:
   ```bash
   npm run dev
   ```

2. Confirm the development server starts without errors

3. Check that installed packages are correctly listed in package.json
