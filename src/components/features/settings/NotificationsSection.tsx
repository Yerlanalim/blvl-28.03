/**
 * @file NotificationsSection.tsx
 * @description Component for managing notification preferences
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPreferences } from '@/hooks/useSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationsSectionProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: keyof UserPreferences, value: any) => void;
  isLoading?: boolean;
}

/**
 * NotificationsSection component
 * 
 * Displays and allows toggling of notification settings
 */
export function NotificationsSection({ 
  preferences, 
  onPreferenceChange,
  isLoading = false
}: NotificationsSectionProps) {
  // Handle toggle change
  const handleToggleChange = (key: keyof UserPreferences) => {
    onPreferenceChange(key, !preferences[key]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <div className="text-sm text-gray-500">
              Receive notifications about your progress via email
            </div>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={() => handleToggleChange('emailNotifications')}
            disabled={isLoading}
          />
        </div>
        
        {/* In-app Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">In-app Notifications</Label>
            <div className="text-sm text-gray-500">
              Receive notifications within the application
            </div>
          </div>
          <Switch
            checked={preferences.appNotifications}
            onCheckedChange={() => handleToggleChange('appNotifications')}
            disabled={isLoading}
          />
        </div>
        
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Dark Mode</Label>
            <div className="text-sm text-gray-500">
              Switch between light and dark theme
            </div>
          </div>
          <Switch
            checked={preferences.darkMode}
            onCheckedChange={() => handleToggleChange('darkMode')}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
} 