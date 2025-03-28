/**
 * @file Chat.ts
 * @description Type definitions for chat functionality
 */

// Message sender types
export enum MessageSender {
  USER = 'user',
  BOT = 'bot'
}

// Chat message
export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date | string;
  read: boolean;
}

// Chat history
export interface ChatHistory {
  userId: string;
  messages: ChatMessage[];
}

// Message for sending to OpenAI
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Chat context with user progress
export interface ChatContext {
  currentLevel?: string;
  completedLevels?: string[];
  skillProgress?: Record<string, number>;
} 