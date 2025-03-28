/**
 * @file AuthCard.tsx
 * @description Authentication card component
 * @dependencies components/ui/card
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * AuthCard component
 * 
 * Styled card component for authentication forms
 */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex justify-center border-t pt-6">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
} 