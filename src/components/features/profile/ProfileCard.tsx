/**
 * @file ProfileCard.tsx
 * @description Component for displaying user profile information
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  user: User;
  businessInfo?: {
    description: string;
    employees: number;
    revenue: string;
    goals: string[];
  };
}

/**
 * ProfileCard component
 * 
 * Displays user profile information and business details
 */
export function ProfileCard({ user, businessInfo }: ProfileCardProps) {
  const hasPartialBusinessInfo = businessInfo && (
    businessInfo.description ||
    businessInfo.employees ||
    businessInfo.revenue ||
    (businessInfo.goals && businessInfo.goals.length > 0)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{user.displayName || 'User'}</span>
          <span className="text-sm text-gray-500 font-normal">Ambitious</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Информация о бизнесе</h3>
          
          {hasPartialBusinessInfo ? (
            <div className="space-y-2">
              {businessInfo?.description && (
                <p className="text-sm">{businessInfo.description}</p>
              )}
              
              <p className="text-sm">
                {[
                  businessInfo?.employees && `${businessInfo.employees} сотрудников`,
                  businessInfo?.revenue && `выручка - ${businessInfo.revenue}`,
                  businessInfo?.goals?.length && `основные цели: ${businessInfo.goals.join(', ')}`
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Информация о бизнесе не заполнена</p>
          )}
          
          <div className="mt-4">
            <Button variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
              Завершить заполнение Бизнес профиля...
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 