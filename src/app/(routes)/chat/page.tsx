/**
 * @file page.tsx
 * @description Chat page with message history and input
 * @dependencies hooks/useChat, components/features/chat/*
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatTabs } from '@/components/features/chat/ChatTabs';
import { MessageList } from '@/components/features/chat/MessageList';
import { MessageInput } from '@/components/features/chat/MessageInput';
import { Textarea } from '@/components/ui/textarea';

export default function ChatPage() {
  const {
    messages,
    isLoading,
    isSending,
    error,
    chatType,
    sendMessage,
    changeChatType
  } = useChat();
  
  // Create ref for the message container
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Show error state
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading chat: {error.message}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Chat &amp; Support</h1>
      <p className="text-gray-600">Get help, feedback, or discuss with fellow learners</p>
      
      {/* Chat type tabs */}
      <ChatTabs
        activeTab={chatType}
        onChange={changeChatType}
      />
      
      {/* Chat interface */}
      <div className="border rounded-lg shadow-sm bg-white h-[600px] flex flex-col">
        {/* Message list */}
        <div className="flex-grow overflow-hidden" ref={messageContainerRef}>
          <MessageList
            messages={messages}
            isLoading={isLoading}
          />
        </div>
        
        {/* Typing indicator when sending */}
        {isSending && (
          <div className="px-4 py-2 text-sm text-gray-500">
            AI assistant is typing...
          </div>
        )}
        
        {/* Message input */}
        <div className="p-4 border-t">
          <MessageInput
            onSend={sendMessage}
            isDisabled={isSending}
            placeholder={
              chatType === 'ai-bot' 
                ? 'Ask the AI assistant...' 
                : chatType === 'group'
                ? 'Type a message to the group...'
                : 'Message your tracker...'
            }
          />
        </div>
      </div>
    </div>
  );
} 