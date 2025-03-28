/**
 * @file MessageList.tsx
 * @description Component for displaying chat message history
 */

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

/**
 * MessageList component
 * 
 * Displays a scrollable list of chat messages
 */
export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Display loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Display empty state
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto flex-grow p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 