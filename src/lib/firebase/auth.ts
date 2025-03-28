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
import { User, UserCreationData, LoginFormData, RegisterFormData, ResetPasswordFormData } from '../../types/User';

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
    
    // Return the user data but convert timestamps to strings for type safety
    return {
      ...userDoc,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    } as User;
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