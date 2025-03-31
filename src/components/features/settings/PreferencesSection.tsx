/**
 * @file PreferencesSection.tsx
 * @description Component for managing user preferences
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences } from '@/hooks/useSettings';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: keyof UserPreferences, value: any) => void;
  isLoading?: boolean;
}

/**
 * PreferencesSection component
 * 
 * Displays and allows editing of user preferences
 */
export function PreferencesSection({ 
  preferences, 
  onPreferenceChange,
  isLoading = false
}: PreferencesSectionProps) {
  // Handle language change
  const handleLanguageChange = (value: string) => {
    onPreferenceChange('language', value as 'english' | 'russian');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Language</label>
          <Select
            disabled={isLoading}
            value={preferences.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="russian">Russian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
} 