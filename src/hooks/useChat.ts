/**
 * @file useChat.ts
 * @description Hook for managing chat functionality
 * @dependencies lib/data/chat-history
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ChatMessage, MessageSender } from '@/types';
import { getChatHistory, addMessage, getAIResponse } from '@/lib/data/chat-history';

export type ChatType = 'ai-bot' | 'group' | 'tracker';

/**
 * Hook for managing chat functionality
 */
export function useChat(initialChatType: ChatType = 'ai-bot') {
  const { user } = useAuth();
  const [chatType, setChatType] = useState<ChatType>(initialChatType);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load chat history
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Get chat history from mock data
      const history = getChatHistory(user.id);
      setMessages(history);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError(err instanceof Error ? err : new Error('Failed to load chat history'));
      setIsLoading(false);
    }
  }, [user, chatType]);

  /**
   * Send a message and get AI response
   */
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !user) return;
    
    try {
      // Add user message
      const userMessage = addMessage({
        text,
        sender: MessageSender.USER,
        read: true
      });
      
      setMessages(prev => [...prev, userMessage]);
      setIsSending(true);
      
      // Get AI response
      let responseText = '';
      
      if (chatType === 'ai-bot') {
        responseText = await getAIResponse(text);
      } else if (chatType === 'group') {
        responseText = "This is a placeholder for group chat. In a real app, this would connect to a real group chat.";
      } else if (chatType === 'tracker') {
        responseText = "This is a placeholder for tracker chat. In a real app, this would connect to a learning tracker/coach.";
      }
      
      // Add AI message
      const botMessage = addMessage({
        text: responseText,
        sender: MessageSender.BOT,
        read: true
      });
      
      setMessages(prev => [...prev, botMessage]);
      setIsSending(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      setIsSending(false);
    }
  }, [user, chatType]);

  /**
   * Change chat type (AI bot, group, tracker)
   */
  const changeChatType = useCallback((type: ChatType) => {
    setChatType(type);
    setIsLoading(true);
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    chatType,
    sendMessage,
    changeChatType
  };
} 