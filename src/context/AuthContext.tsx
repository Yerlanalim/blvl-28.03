/**
 * @file AuthContext.tsx
 * @description Authentication context provider
 * @dependencies firebase/auth, types/User
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, LoginFormData, RegisterFormData, ResetPasswordFormData, UserCreationData } from '../types/User';
import { 
  onAuthStateChange, 
  getUserData, 
  signIn as firebaseSignIn, 
  signOut as firebaseSignOut,
  createUser as firebaseCreateUser,
  resetPassword as firebaseResetPassword
} from '../lib/firebase/auth';

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
        photoURL: null,
        emailVerified: false,
        role: 'user',
        businessInfo: data.businessInfo
      } as UserCreationData);
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