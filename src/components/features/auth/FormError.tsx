/**
 * @file FormError.tsx
 * @description Error message component for forms
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
}

/**
 * FormError component
 * 
 * Displays form validation or submission errors
 */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start text-sm mt-2">
      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
} 