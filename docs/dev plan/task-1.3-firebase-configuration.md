# Task 1.3: Set up Firebase Configuration

## Task Details

```
Task: Configure Firebase integration
Reference: Technical Stack and Database Schema sections in project description
Context: We need to connect our application to Firebase services
Current Files: Project structure and type definitions from previous tasks
Previous Decision: Use Firebase for authentication, database, and storage
```

## Context Recovery Steps

1. Review the project description document, particularly the Technical Stack section:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the project structure:
   ```bash
   find . -type f -not -path "*/node_modules/*" -not -path "*/\.git/*" -not -path "*/\.next/*" | sort
   ```

4. Review the type definitions that will interact with Firebase:
   ```bash
   cat types/User.ts
   cat types/Level.ts
   cat types/Progress.ts
   cat types/Artifact.ts
   ```

## Implementation Steps

```
1. Create `/lib/firebase/config.ts`:

```typescript
/**
 * @file config.ts
 * @description Firebase configuration and initialization
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export initialized services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
```

2. Create `/lib/firebase/auth.ts`:

```typescript
/**
 * @file auth.ts
 * @description Firebase authentication utility functions
 * @dependencies firebase/auth, types/User
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUserType,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserCreationData, LoginFormData, RegisterFormData, ResetPasswordFormData } from '@/types/User';

/**
 * Create a new user with email and password
 * 
 * @param userData - The user data to create the account with
 * @returns A promise that resolves with the created user data
 * @throws Error if user creation fails
 */
export const createUser = async (userData: UserCreationData): Promise<User> => {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email as string, 
      userData.password
    );
    
    // Update the user profile
    if (userData.displayName) {
      await updateProfile(userCredential.user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL || null
      });
    }
    
    // Create the user document in Firestore
    const userDoc = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userData.displayName || null,
      photoURL: userData.photoURL || null,
      emailVerified: userCredential.user.emailVerified,
      businessInfo: userData.businessInfo || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: userData.role || 'user'
    };
    
    // Save user document to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    
    // Initialize empty progress document
    await setDoc(doc(db, 'userProgress', userCredential.user.uid), {
      userId: userCredential.user.uid,
      completedLevels: [],
      currentLevel: null,
      skillProgress: {
        personalSkills: 0,
        management: 0,
        networking: 0,
        clientWork: 0,
        finance: 0,
        legal: 0
      },
      badges: [],
      downloadedArtifacts: [],
      watchedVideos: [],
      completedTests: [],
      lastUpdated: serverTimestamp()
    });
    
    return userDoc as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * 
 * @param loginData - Email and password for login
 * @returns A promise that resolves with the user credential
 * @throws Error if sign in fails
 */
export const signIn = async (loginData: LoginFormData): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    );
    
    // Update last login timestamp
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    
    return userCredential;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * 
 * @returns A promise that resolves when sign out is complete
 */
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

/**
 * Send a password reset email
 * 
 * @param data - Email to send the reset link to
 * @returns A promise that resolves when the email is sent
 * @throws Error if sending reset email fails
 */
export const resetPassword = async (data: ResetPasswordFormData): Promise<void> => {
  try {
    return sendPasswordResetEmail(auth, data.email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 * 
 * @param userId - The user ID to get data for
 * @returns A promise that resolves with the user data
 * @throws Error if fetching user data fails
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { id: userId, ...userDoc.data() } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Subscribe to auth state changes
 * 
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (callback: (user: FirebaseUserType | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

3. Create `/lib/firebase/firestore.ts`:

```typescript
/**
 * @file firestore.ts
 * @description Firestore database utility functions
 * @dependencies firebase/firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';
import { ApiResponse } from '@/types';

/**
 * Generic function to get a document by ID
 * 
 * @param collectionName - The collection to get the document from
 * @param id - The document ID
 * @returns The document data with ID
 * @throws Error if fetching fails
 */
export const getDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<T> => {
  try {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error(`Document not found: ${collectionName}/${id}`);
    }
    
    return { id, ...snapshot.data() } as T;
  } catch (error) {
    console.error(`Error getting ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Generic function to get multiple documents from a collection
 * 
 * @param collectionName - The collection to query
 * @param constraints - Query constraints (where, orderBy, limit, etc.)
 * @returns Array of documents with IDs
 * @throws Error if query fails
 */
export const getDocuments = async <T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints) 
      : query(collectionRef);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error querying ${collectionName} collection:`, error);
    throw error;
  }
};

/**
 * Create or update a document
 * 
 * @param collectionName - The collection to add the document to
 * @param data - The document data
 * @param id - Optional document ID (if not provided, one will be generated)
 * @returns The document ID
 * @throws Error if saving fails
 */
export const saveDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> => {
  try {
    const docRef = id 
      ? doc(db, collectionName, id) 
      : doc(collection(db, collectionName));
    
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      updatedAt: serverTimestamp(),
      ...(id ? {} : { createdAt: serverTimestamp() })
    };
    
    await (id 
      ? updateDoc(docRef, dataWithTimestamps) 
      : setDoc(docRef, dataWithTimestamps)
    );
    
    return docRef.id;
  } catch (error) {
    console.error(`Error saving ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Delete a document by ID
 * 
 * @param collectionName - The collection containing the document
 * @param id - The document ID to delete
 * @throws Error if deletion fails
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting ${collectionName} document:`, error);
    throw error;
  }
};

/**
 * Convert Firestore timestamp to Date
 * 
 * @param timestamp - Firestore timestamp
 * @returns JavaScript Date object
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Helper function to create query constraints
 */
export const createQueryConstraints = {
  where: where,
  orderBy: orderBy,
  limit: limit
};
```

4. Create `/lib/firebase/storage.ts`:

```typescript
/**
 * @file storage.ts
 * @description Firebase Storage utility functions
 * @dependencies firebase/storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  list,
  ListResult,
  StorageReference,
  uploadString
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage
 * 
 * @param path - The path to upload the file to
 * @param file - The file to upload
 * @returns The download URL for the uploaded file
 * @throws Error if upload fails
 */
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a string (e.g., base64 data) to Firebase Storage
 * 
 * @param path - The path to upload the data to
 * @param data - The string data to upload
 * @param format - The format of the data
 * @returns The download URL for the uploaded file
 * @throws Error if upload fails
 */
export const uploadFileFromString = async (
  path: string,
  data: string,
  format: 'raw' | 'base64' | 'base64url' | 'data_url' = 'data_url'
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, data, format);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file from string:', error);
    throw error;
  }
};

/**
 * Get the download URL for a file
 * 
 * @param path - The path to the file
 * @returns The download URL
 * @throws Error if getting the URL fails
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param path - The path to the file to delete
 * @throws Error if deletion fails
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * List files in a directory
 * 
 * @param path - The path to list files from
 * @returns A ListResult object
 * @throws Error if listing fails
 */
export const listFiles = async (path: string): Promise<ListResult> => {
  try {
    const storageRef = ref(storage, path);
    return await list(storageRef);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};
```

5. Create `/lib/firebase/index.ts` to export all Firebase utilities:

```typescript
/**
 * @file index.ts
 * @description Central export for Firebase utilities
 */

export * from './config';
export * from './auth';
export * from './firestore';
export * from './storage';
```

6. Ensure the `.env.local` file has all required Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Expected Output

```
- Firebase configuration files in the `/lib/firebase` directory:
  - config.ts - Firebase initialization
  - auth.ts - Authentication utilities
  - firestore.ts - Firestore database utilities
  - storage.ts - Firebase Storage utilities
  - index.ts - Central export
- Environment variables properly set up
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Firebase integration

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities

   ## Current Issues
   - None

   ## Next Up
   - Task 1.4: Create Authentication Context and Hooks

   ## Component Status
   - Authentication: In Progress (Firebase utilities created)
   - Level Map: Not Started (Type definitions created)
   - Level Detail: Not Started (Type definitions created)
   - Profile: Not Started (Type definitions created)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started
   ```

2. Create `/docs/features/firebase-integration.md` with a description of the Firebase utilities:
   ```markdown
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
   ```

## Testing Instructions

1. Verify Firebase configuration works:
   - Create a test file to import and use the Firebase utilities
   - Check that Firebase initializes without errors

2. Test TypeScript integration:
   ```bash
   npx tsc --noEmit
   ```

3. Ensure `.env.local` file contains all required Firebase configuration values

4. Add a note in README.md about Firebase setup requirements
