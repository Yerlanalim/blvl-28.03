/**
 * @file User.ts
 * @description Type definitions for user data, authentication, and business information
 */

// Base user type from Firebase Auth
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Business information type
export interface BusinessInfo {
  description: string;
  employees: number;
  revenue: string;
  goals: string[];
}

// Application user with additional fields
export interface User extends Omit<FirebaseUser, 'uid'> {
  id: string; // Same as uid, just renamed for consistency
  businessInfo?: BusinessInfo;
  createdAt: Date | string;
  lastLogin: Date | string;
  role: 'user' | 'admin';
}

// User creation data
export type UserCreationData = Omit<User, 'id' | 'createdAt' | 'lastLogin'> & {
  password: string;
};

// Authentication form data
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData extends LoginFormData {
  displayName: string;
  businessInfo?: BusinessInfo;
}

export interface ResetPasswordFormData {
  email: string;
} 