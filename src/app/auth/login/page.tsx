/**
 * @file auth/login/page.tsx
 * @description Login page component
 * @dependencies hooks/useAuth, components/ui
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Type for form values
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/map';
  
  // Form error state
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      await signIn({
        email: data.email,
        password: data.password,
      });
      
      // Get stored redirect path or use default
      const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
      const redirectPath = storedRedirect || redirectTo;
      
      // Clear stored redirect
      if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
      }
      
      // Redirect after successful login
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      setFormError(getErrorMessage(error));
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
      title="Sign in to your account"
      description="Enter your credentials to access your account"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-teal-600 hover:text-teal-500">
              Register
            </Link>
          </p>
        </div>
      }
    >
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              Forgot password?
            </Link>
          </div>
          
          {formError && <FormError message={formError} />}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
} 