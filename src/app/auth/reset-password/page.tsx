/**
 * @file auth/reset-password/page.tsx
 * @description Password reset page component
 * @dependencies hooks/useAuth, components/ui
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/features/auth/AuthCard';
import { FormError } from '@/components/features/auth/FormError';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Form validation schema
const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Type for form values
type ResetPasswordFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  
  // Form states
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      await resetPassword({
        email: data.email,
      });
      
      // Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Extract error message from various error types
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'An unknown error occurred. Please try again.';
  };
  
  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email to receive a password reset link"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <p className="block sm:inline">
            Password reset email sent! Check your inbox for instructions.
          </p>
          <div className="mt-4">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      {...field} 
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {formError && <FormError message={formError} />}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
      )}
    </AuthCard>
  );
} 