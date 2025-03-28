/**
 * @file auth/register/page.tsx
 * @description Registration page component
 * @dependencies hooks/useAuth, components/ui
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '../../../components/features/auth/AuthCard';
import { FormError } from '../../../components/features/auth/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BusinessInfo } from '@/types/User';

// Form validation schema
const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  businessDescription: z.string().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  businessGoals: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type for form values
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  
  // Form error state
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessDescription: '',
      employees: '',
      revenue: '',
      businessGoals: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      
      // Process business info
      const businessInfo: BusinessInfo = {
        description: data.businessDescription || '',
        employees: parseInt(data.employees || '0') || 0,
        revenue: data.revenue || '',
        goals: data.businessGoals ? data.businessGoals.split(',').map(g => g.trim()) : [],
      };
      
      await signUp({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        businessInfo: businessInfo,
      });
      
      // Redirect to map after successful registration
      router.push('/map');
    } catch (error) {
      console.error('Registration error:', error);
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
      title="Create your account"
      description="Register to access the BizLevel platform"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <h3 className="text-md font-medium mb-2">Business Information (Optional)</h3>
            
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe your business" 
                      className="resize-none"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. $100k - $500k" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Business Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your goals, separated by commas" 
                      className="resize-none"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your key business goals, separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {formError && <FormError message={formError} />}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
} 