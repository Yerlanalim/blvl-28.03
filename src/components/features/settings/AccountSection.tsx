/**
 * @file AccountSection.tsx
 * @description Component for displaying and editing account information
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { MailIcon, UserIcon, KeyIcon } from 'lucide-react';

interface AccountSectionProps {
  onPasswordChangeClick: () => void;
}

/**
 * AccountSection component
 * 
 * Displays and allows editing of account information
 */
export function AccountSection({ onPasswordChangeClick }: AccountSectionProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // In a real app, we would save these changes to Firebase Auth
  const handleSave = () => {
    console.log('Saving account info:', { username, email });
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Email field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Username field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Password field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <Input
                type="password"
                value="••••••••"
                disabled={true}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row sm:justify-between gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="outline" onClick={onPasswordChangeClick}>
                  Change Password
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 