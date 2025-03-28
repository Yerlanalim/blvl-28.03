# Firebase Integration

## Overview
This document describes how Firebase services are integrated into the BizLevel application.

## Firebase Services Used
- **Authentication**: User sign-up, login, password reset
- **Firestore**: Database for user data, levels, progress tracking
- **Storage**: File storage for artifacts (PDFs, documents, etc.)

## Utility Functions

### Authentication (`lib/firebase/auth.ts`)
- `createUser`: Register a new user with email and password
- `signIn`: Authenticate users with email and password
- `signOut`: Sign out the current user
- `resetPassword`: Send password reset email
- `getUserData`: Get user profile data from Firestore
- `onAuthStateChange`: Subscribe to authentication state changes

### Firestore (`lib/firebase/firestore.ts`)
- `getDocumentById`: Fetch a document by ID
- `getDocuments`: Query documents with filters
- `saveDocument`: Create or update a document
- `deleteDocument`: Delete a document
- `createQueryConstraints`: Helpers for building queries

### Storage (`lib/firebase/storage.ts`)
- `uploadFile`: Upload a file to Firebase Storage
- `uploadFileFromString`: Upload string data (base64, etc.)
- `getFileURL`: Get a download URL for a file
- `deleteFile`: Delete a file from storage
- `listFiles`: List files in a directory

## Implementation Details
- All Firebase services are initialized as singletons
- Environment variables are used for configuration
- Error handling is implemented for all operations
- Timestamps are automatically added to Firestore documents 