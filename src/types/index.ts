/**
 * @file index.ts
 * @description Central export for all type definitions
 */

export * from './User';
export * from './Level';
export * from './Progress';
export * from './Artifact';
export * from './Chat';

// Common types used across the application
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
} 