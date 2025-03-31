# Task 5.2: Deployment Configuration

## Task Details

```
Task: Set up deployment configuration for production
Reference: Technical Stack section in project description
Context: Application is feature complete and needs to be deployed
Current Files: All application files from previous tasks
Previous Decision: Use Firebase Hosting for deployment
```

## Context Recovery Steps

1. Review the project description document for deployment requirements:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Check the existing Firebase configuration:
   ```bash
   cat lib/firebase/config.ts
   ```

4. Verify package.json for dependencies and scripts:
   ```bash
   cat package.json
   ```

## Implementation Steps

```
1. Create `.firebaserc` at the project root for Firebase project connection:

```json
{
  "projects": {
    "default": "bizlevel-app"
  }
}
```

2. Create `firebase.json` at the project root for Firebase configuration:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(eot|otf|ttf|ttc|woff|woff2|font.css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

3. Create `firestore.rules` at the project root:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles can be read by anyone but only written by the user themselves
    match /users/{userId} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progress can only be read and written by the user
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Levels are readable by anyone but only writable by admins
    match /levels/{levelId} {
      allow read;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Artifacts are readable by anyone but only writable by admins
    match /artifacts/{artifactId} {
      allow read;
      allow write: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Chat messages can be read and written by the associated user
    match /chatHistory/{userId}/messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Create `firestore.indexes.json` at the project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "artifacts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "fileType", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "chatHistory",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

5. Create `storage.rules` at the project root:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Artifacts folder can be read by authenticated users
    match /artifacts/{artifactId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.size < 10 * 1024 * 1024 && // 10MB max
                     request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
    
    // User uploads can only be managed by the user themselves
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Update `next.config.js` at the project root:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Static export for Firebase Hosting
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Ensure environment variables are exposed to client
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
}

module.exports = nextConfig
```

7. Create `.env.production` at the project root:

```
# Firebase Configuration (Replace with actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI API Key (if used)
OPENAI_API_KEY=your_openai_api_key

# Environment Flag
NODE_ENV=production
```

8. Update `package.json` scripts section:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "export": "next build && next export",
  "deploy": "npm run export && firebase deploy",
  "deploy:hosting": "npm run export && firebase deploy --only hosting",
  "deploy:rules": "firebase deploy --only firestore:rules,storage:rules",
  "emulators": "firebase emulators:start"
}
```

9. Create `.github/workflows/firebase-hosting-merge.yml` for CI/CD pipeline:

```yaml
name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

10. Create `.github/workflows/firebase-hosting-pull-request.yml` for PR previews:

```yaml
name: Deploy to Firebase Hosting on PR
'on': pull_request
jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

11. Create `public/robots.txt` at the project root:

```
User-agent: *
Allow: /

Sitemap: https://bizlevel-app.web.app/sitemap.xml
```

12. Create `/docs/deployment/deployment-guide.md`:

```markdown
# Deployment Guide

This document provides instructions for deploying the BizLevel application to Firebase Hosting.

## Prerequisites

- Node.js 18+ and npm 9+
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created in the Firebase Console
- Authentication, Firestore, and Storage enabled in the Firebase project
- Service account credentials for CI/CD (if using GitHub Actions)

## Environment Setup

1. Create or update the following environment files:

   - `.env.local` - Local development environment
   - `.env.production` - Production environment

   Both files should contain the Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # If using OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

2. Update `.firebaserc` with your Firebase project ID:

   ```json
   {
     "projects": {
       "default": "your-project-id"
     }
   }
   ```

## Manual Deployment

### One-time Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
   
   Select the following features:
   - Firestore
   - Hosting
   - Storage
   - (optionally) Emulators

### Deployment Steps

1. Build the Next.js application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

   This will:
   - Build the Next.js application
   - Export static files to the `out` directory
   - Deploy to Firebase Hosting
   - Deploy Firestore and Storage rules

### Partial Deployments

To deploy only specific parts:

- Deploy only to hosting:
  ```bash
  npm run deploy:hosting
  ```

- Deploy only Firestore and Storage rules:
  ```bash
  npm run deploy:rules
  ```

## CI/CD Deployment (GitHub Actions)

The repository includes GitHub Actions workflows for automated deployments:

1. **On merge to main**: Automatically deploys to the live channel
   - File: `.github/workflows/firebase-hosting-merge.yml`

2. **On pull request**: Creates a preview deployment
   - File: `.github/workflows/firebase-hosting-pull-request.yml`

### Setting up GitHub Secrets

For CI/CD to work, add the following secrets to your GitHub repository:

1. `FIREBASE_API_KEY`
2. `FIREBASE_AUTH_DOMAIN`
3. `FIREBASE_PROJECT_ID`
4. `FIREBASE_STORAGE_BUCKET`
5. `FIREBASE_MESSAGING_SENDER_ID`
6. `FIREBASE_APP_ID`
7. `FIREBASE_MEASUREMENT_ID`
8. `FIREBASE_SERVICE_ACCOUNT` (JSON content of service account key)
9. `OPENAI_API_KEY` (if using OpenAI)

### Obtaining a Firebase Service Account

1. Go to the Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Add the entire JSON content as the `FIREBASE_SERVICE_ACCOUNT` secret

## Post-Deployment Steps

After deployment, verify the following:

1. Website is accessible at your Firebase Hosting URL
2. Authentication works correctly
3. Firebase Security Rules are applied correctly
4. All static assets are loading properly
5. Check Firebase Console for any errors

## Troubleshooting

### Common Issues

1. **Routing issues**: Ensure `firebase.json` has the correct rewrites section
2. **Missing environment variables**: Verify all environment variables are set correctly
3. **Authentication errors**: Check Firebase Authentication configuration
4. **Security Rules**: Test Firestore and Storage rules using the Firebase Emulator

### Debugging

1. Check Firebase Hosting logs:
   ```bash
   firebase hosting:log
   ```

2. Use Firebase Emulators for local testing:
   ```bash
   npm run emulators
   ```

3. Check browser console for client-side errors

## Production Monitoring

Once deployed, monitor the application using:

1. **Firebase Console**: Check usage, errors, and performance
2. **Google Analytics**: Monitor user behavior
3. **Firebase Crashlytics**: Track application crashes
4. **Firebase Performance Monitoring**: Track performance metrics
```

13. Create `/docs/deployment/security-rules-guide.md`:

```markdown
# Firebase Security Rules Guide

This document explains the Firebase Security Rules implemented for the BizLevel application.

## Overview

Firebase Security Rules protect your data and resources by defining who has access to what. The BizLevel application uses security rules for:

1. Firestore Database
2. Cloud Storage
3. Firebase Authentication

## Firestore Rules

The Firestore rules (`firestore.rules`) define access control for the database collections.

### User Profiles

```
match /users/{userId} {
  allow read;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

- **Read**: Anyone can read user profiles (non-sensitive information only)
- **Write**: Only the user themselves can update their profile

### User Progress

```
match /userProgress/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

- **Read/Write**: Only the user can read and update their own progress

### Levels

```
match /levels/{levelId} {
  allow read;
  allow write: if request.auth != null && 
                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

- **Read**: Anyone can read level data
- **Write**: Only administrators can update level content

### Artifacts

```
match /artifacts/{artifactId} {
  allow read;
  allow write: if request.auth != null && 
                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

- **Read**: Anyone can read artifact metadata
- **Write**: Only administrators can update artifacts

### Chat History

```
match /chatHistory/{userId}/messages/{messageId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

- **Read/Write**: Only the user can access their own chat history

## Storage Rules

The Storage rules (`storage.rules`) define access control for stored files.

### Artifacts Storage

```
match /artifacts/{artifactId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
                 request.resource.size < 10 * 1024 * 1024 && 
                 request.resource.contentType.matches('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
```

- **Read**: Any authenticated user can access artifacts
- **Write**: Authenticated users can upload files with restrictions:
  - Maximum size: 10MB
  - Allowed file types: PDF, Word, Excel documents

### User Uploads

```
match /users/{userId}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

- **Read**: Any authenticated user can view user uploads
- **Write**: Only the user themselves can upload their own files

## Security Rule Testing

### Using the Firebase Emulator

1. Start the emulators:
   ```bash
   firebase emulators:start
   ```

2. Access the Firestore and Storage emulators in the browser:
   - Firestore: http://localhost:4000/firestore
   - Storage: http://localhost:4000/storage

3. Test rules with the Rules Playground in the emulator UI

### Automated Rule Testing

For advanced testing, create rule unit tests using the Firebase Rules testing framework:

1. Install testing dependencies:
   ```bash
   npm install -D @firebase/rules-unit-testing
   ```

2. Create test files in the `tests/rules` directory
3. Run tests with:
   ```bash
   npm run test:rules
   ```

## Best Practices

1. **Principle of least privilege**: Grant only the permissions needed
2. **Validate data**: Always validate data structure and content
3. **Use authentication**: Base rules on authentication state
4. **Prevent excessive reads**: Optimize rules to minimize database reads
5. **Test thoroughly**: Test rules with various scenarios

## Common Rule Patterns

### Role-Based Access

```
allow write: if request.auth != null && 
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

### Data Validation

```
allow create: if request.auth != null && 
              request.resource.data.keys().hasAll(['title', 'description', 'createdAt']) &&
              request.resource.data.title is string &&
              request.resource.data.title.size() > 0;
```

### Owner-Only Access

```
allow write: if request.auth != null && 
              resource.data.userId == request.auth.uid;
```

## Updating Rules

After updating security rules:

1. Test thoroughly using the emulator
2. Deploy only the rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
3. Verify rules are applied correctly in the Firebase Console
```

14. Create `.gitignore` additions for deployment-related files:

```
# Firebase
.firebase/
firebase-debug.log
firebaserc

# Build output
out/
.next/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production
.env.production.local

# Service account keys
*-service-account.json
```

## Expected Output

```
- Deployment configuration files:
  - /.firebaserc
  - /firebase.json
  - /firestore.rules
  - /firestore.indexes.json
  - /storage.rules
  - /.env.production
  - /next.config.js (updated)
  - /package.json (updated scripts)
  - /.github/workflows/firebase-hosting-merge.yml
  - /.github/workflows/firebase-hosting-pull-request.yml
  - /public/robots.txt
  - /docs/deployment/deployment-guide.md
  - /docs/deployment/security-rules-guide.md
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Deployment configuration and preparation for release

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
   - Task 3.4: Create FAQ Page
   - Task 4.1: Implement Progress Tracking System
   - Task 4.2: Implement Skill Progress Calculation
   - Task 4.3: Implement Badges and Achievements
   - Task 5.1: System Integration and Testing
   - Task 5.2: Deployment Configuration

   ## Current Issues
   - None

   ## Next Up
   - Task 5.3: Documentation Finalization

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Complete (Account settings, preferences, and notifications)
   - FAQ: Complete (Categorized FAQs with search functionality)
   - Progress Tracking: Complete (Tracking system with skill progress calculation)
   - Badges: Complete (Badge system and achievement notifications)
   - Testing: Complete (Testing documentation and test plans)
   - Deployment: Complete (Configuration for Firebase deployment)
   ```

2. Create `/docs/features/deployment.md` with a description of the deployment strategy:
   ```markdown
   # Deployment Strategy

   ## Overview
   This document describes the deployment approach for the BizLevel application, which uses Firebase Hosting for production deployment.

   ## Deployment Architecture

   ### Firebase Services
   - **Firebase Hosting**: Web application hosting
   - **Firebase Authentication**: User authentication
   - **Cloud Firestore**: Database for application data
   - **Firebase Storage**: File storage for artifacts
   - **Firebase Security Rules**: Access control

   ### Static Export
   BizLevel uses Next.js static export (`next export`) to generate static HTML files that can be served by Firebase Hosting. This approach:
   - Provides fast loading times
   - Reduces server costs
   - Simplifies deployment
   - Works well with Firebase services

   ## Deployment Process

   ### Development Workflow
   1. Local development using Next.js development server
   2. Firebase Emulator for testing Firebase services locally
   3. Code reviews through pull requests
   4. Automated preview deployments for pull requests

   ### Production Deployment
   1. Build and export the Next.js application
   2. Deploy static files to Firebase Hosting
   3. Deploy security rules for Firestore and Storage
   4. Verify deployment with post-deployment checks

   ## Environment Management

   ### Environment Variables
   - `.env.local` for local development
   - `.env.production` for production deployment
   - GitHub Secrets for CI/CD pipeline

   ### Configuration Files
   - `next.config.js` for Next.js configuration
   - `firebase.json` for Firebase configuration
   - `firestore.rules` for Firestore security rules
   - `storage.rules` for Storage security rules

   ## Security Considerations

   ### Data Protection
   - Firebase Security Rules protect data access
   - User authentication controls content access
   - Data validation ensures integrity

   ### Authentication Security
   - Secure authentication flow
   - Token-based session management
   - Protection against common attacks

   ## Continuous Integration and Deployment

   ### CI/CD Pipeline
   - GitHub Actions for automated builds and deployments
   - Preview deployments for pull requests
   - Automatic deployment on merge to main branch
   - Environment variable injection

   ### Testing Before Deployment
   - Unit tests run before deployment
   - Security rules validation
   - Build validation
   - Type checking

   ## Monitoring and Maintenance

   ### Post-Deployment Monitoring
   - Firebase Console for usage and performance
   - Error tracking and reporting
   - User analytics

   ### Update Process
   - Scheduled maintenance updates
   - Security patches
   - Feature releases
   ```

3. Update `/README.md` with deployment information:
   ```markdown
   # BizLevel

   A gamified learning platform for entrepreneurs to improve business skills through short videos, interactive tests, and practical tools.

   ## Features

   - 🎮 Gamified learning path with 10 progressive levels
   - 🎥 Short-format educational videos (2-4 minutes each)
   - 📝 Interactive tests and quizzes
   - 📄 Downloadable practical resources
   - 📊 Skill progress tracking across 6 business competencies
   - 🏆 Achievement badges for gamification
   - 💬 AI assistant for learning support

   ## Tech Stack

   - **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
   - **Backend**: Firebase (Auth, Firestore, Storage)
   - **Integrations**: YouTube API, OpenAI API

   ## Getting Started

   ### Prerequisites

   - Node.js 18+ and npm 9+
   - Firebase project (for backend services)
   - Firebase CLI installed

   ### Installation

   1. Clone the repository
      ```bash
      git clone https://github.com/yourusername/bizlevel.git
      cd bizlevel
      ```

   2. Install dependencies
      ```bash
      npm install
      ```

   3. Set up environment variables
      - Copy `.env.example` to `.env.local`
      - Add your Firebase configuration and API keys

   4. Start the development server
      ```bash
      npm run dev
      ```

   5. Open [http://localhost:3000](http://localhost:3000) in your browser

   ### Firebase Setup

   1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   2. Enable Authentication, Firestore, and Storage
   3. Update `.firebaserc` with your project ID
   4. Login to Firebase CLI
      ```bash
      firebase login
      ```
   5. Start Firebase emulators for local development
      ```bash
      npm run emulators
      ```

   ## Deployment

   ### Manual Deployment

   ```bash
   npm run deploy
   ```

   ### CI/CD Deployment

   The project includes GitHub Actions workflows for:
   - Automated deployment on merge to main
   - Preview deployments for pull requests

   See [Deployment Guide](./docs/deployment/deployment-guide.md) for details.

   ## Project Structure

   - `/app` - Next.js pages and routing
   - `/components` - React components
   - `/lib` - Utilities and Firebase services
   - `/hooks` - React hooks
   - `/context` - React context providers
   - `/types` - TypeScript type definitions
   - `/public` - Static assets
   - `/docs` - Documentation

   ## Documentation

   - [Features](./docs/features/)
   - [Deployment](./docs/deployment/)
   - [Testing](./docs/testing/)

   ## License

   This project is licensed under the MIT License - see the LICENSE file for details.
   ```

## Testing Instructions

1. Verify Firebase configuration:
   - Create a Firebase project in the Firebase Console
   - Enable Authentication, Firestore, and Storage
   - Update the Firebase configuration in `.env.local`

2. Test local build and export:
   ```bash
   npm run build
   ```
   - Verify that the build completes successfully
   - Check the generated `out` directory for static files

3. Test Firebase Emulators:
   ```bash
   firebase emulators:start
   ```
   - Verify that the emulators start successfully
   - Test the application using the emulators

4. Test security rules with the Firebase Rules Playground:
   - Use the Firebase Emulator UI to test security rules
   - Verify that the rules protect data as expected

5. Prepare for deployment:
   - Update `.firebaserc` with your Firebase project ID
   - Set up GitHub Secrets for CI/CD (if using GitHub Actions)
   - Test the deploy script locally (if possible)
