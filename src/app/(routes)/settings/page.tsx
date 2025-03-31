/**
 * @file page.tsx
 * @description Settings page for managing user preferences
 * @dependencies hooks/useSettings, components/features/settings/*
 */

'use client';

import React, { useState } from 'react';
import { useSettings, UserPreferences } from '@/hooks/useSettings';
import { AccountSection } from '@/components/features/settings/AccountSection';
import { PreferencesSection } from '@/components/features/settings/PreferencesSection';
import { NotificationsSection } from '@/components/features/settings/NotificationsSection';
import { PasswordChangeModal } from '@/components/features/settings/PasswordChangeModal';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SettingsPage() {
  const {
    preferences,
    loading,
    error,
    isSaving,
    isSuccess,
    updatePreferences,
    changePassword
  } = useSettings();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Handle preference change
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    updatePreferences({ [key]: value });
  };
  
  // Handle password change
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    return await changePassword(currentPassword, newPassword);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings &amp; Preferences</h1>
        <p className="text-gray-600 mt-1">Manage your account, notifications, and more.</p>
      </div>
      
      {/* Success or error alert */}
      {(isSuccess || error) && (
        <Alert variant={isSuccess ? "default" : "destructive"}>
          {isSuccess ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isSuccess ? 'Settings Updated' : 'Error'}
          </AlertTitle>
          <AlertDescription>
            {isSuccess 
              ? 'Your settings have been saved successfully.' 
              : `Failed to save settings: ${error?.message}`
            }
          </AlertDescription>
        </Alert>
      )}
      
      {/* Account settings */}
      <AccountSection 
        onPasswordChangeClick={() => setIsPasswordModalOpen(true)} 
      />
      
      {/* Preferences */}
      <PreferencesSection 
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        isLoading={isSaving}
      />
      
      {/* Notifications */}
      <NotificationsSection 
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        isLoading={isSaving}
      />
      
      {/* Password change modal */}
      <PasswordChangeModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChange={handlePasswordChange}
        isLoading={isSaving}
      />
    </div>
  );
} 