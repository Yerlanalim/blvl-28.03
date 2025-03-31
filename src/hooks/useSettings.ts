/**
 * @file useSettings.ts
 * @description Hook for managing user settings and preferences
 * @dependencies hooks/useAuth
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// User preferences type
export interface UserPreferences {
  language: 'english' | 'russian';
  emailNotifications: boolean;
  appNotifications: boolean;
  darkMode: boolean;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'english',
  emailNotifications: true,
  appNotifications: true,
  darkMode: false
};

/**
 * Hook for managing user settings and preferences
 */
export function useSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // In a real app, we'd fetch from Firestore
      // For MVP, we'll use mock data (localStorage for persistence)
      const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
      
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError(err instanceof Error ? err : new Error('Failed to load preferences'));
      setLoading(false);
    }
  }, [user]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      setIsSuccess(false);
      
      // Update local state
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };
      
      setPreferences(updatedPreferences);
      
      // In a real app, we'd save to Firestore
      // For MVP, we'll use localStorage
      localStorage.setItem(
        `preferences_${user.id}`, 
        JSON.stringify(updatedPreferences)
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSaving(false);
      setIsSuccess(true);
      
      // Reset success status after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err instanceof Error ? err : new Error('Failed to save preferences'));
      setIsSaving(false);
    }
  }, [user, preferences]);

  /**
   * Change user password
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    
    try {
      setIsSaving(true);
      setIsSuccess(false);
      
      // In a real app, we'd call Firebase Auth
      // For MVP, we'll simulate API call
      console.log('Changing password:', { currentPassword, newPassword });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaving(false);
      setIsSuccess(true);
      
      // Reset success status after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
      
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err : new Error('Failed to change password'));
      setIsSaving(false);
      return false;
    }
  }, [user]);

  return {
    preferences,
    loading,
    error,
    isSaving,
    isSuccess,
    updatePreferences,
    changePassword
  };
} 