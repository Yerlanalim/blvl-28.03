# Task 3.2: Implement Chat Interface

## Task Details

```
Task: Build AI assistant chat interface
Reference: Implementation Notes and UI Reference (Image 5) in project description
Context: Users need help and guidance through an AI assistant
Current Files:
- /types/Chat.ts (Chat type definitions)
- /app/(main)/chat/page.tsx (Chat page placeholder)
Previous Decision: Follow the UI design in Image 5 with chat tabs, message history, and AI integration
```

## Context Recovery Steps

1. Review the project description document, particularly the Chat Interface section in Implementation Notes:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Chat type definitions:
   ```bash
   cat types/Chat.ts
   ```

4. Review the chat page placeholder:
   ```bash
   cat app/\(main\)/chat/page.tsx
   ```

## Implementation Steps

```
1. Create `/lib/data/chat-history.ts` with mock chat data:

```typescript
/**
 * @file chat-history.ts
 * @description Mock data for chat history
 */

import { ChatMessage, MessageSender } from '@/types';

/**
 * Mock chat history data for development purposes
 */
export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hello! How can I help you with your business learning today?',
    sender: MessageSender.BOT,
    timestamp: new Date(Date.now() - 1000000).toISOString(),
    read: true
  },
  {
    id: 'msg-2',
    text: 'I need help understanding the SMART framework for goal setting.',
    sender: MessageSender.USER,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    read: true
  },
  {
    id: 'msg-3',
    text: 'The SMART framework is a methodology for setting effective goals. SMART stands for:\n\nS - Specific: Goals should be clear and specific.\nM - Measurable: You should be able to track progress.\nA - Achievable: Goals should be realistic.\nR - Relevant: Goals should align with your business objectives.\nT - Time-bound: Set a deadline for achievement.\n\nWould you like an example of a SMART goal?',
    sender: MessageSender.BOT,
    timestamp: new Date(Date.now() - 850000).toISOString(),
    read: true
  },
  {
    id: 'msg-4',
    text: 'Yes, please give me an example for my small business.',
    sender: MessageSender.USER,
    timestamp: new Date(Date.now() - 800000).toISOString(),
    read: true
  },
  {
    id: 'msg-5',
    text: 'Here\'s a SMART goal example for a small business:\n\n"Increase monthly online sales by 20% within the next 3 months by implementing a new email marketing campaign targeting existing customers and optimizing the checkout process."\n\nThis goal is:\n- Specific: Focuses on online sales through specific strategies\n- Measurable: 20% increase can be tracked\n- Achievable: Uses practical strategies that are within reach\n- Relevant: Directly impacts business revenue\n- Time-bound: Set to achieve within 3 months\n\nWould you like help creating a SMART goal for your specific business?',
    sender: MessageSender.BOT,
    timestamp: new Date(Date.now() - 750000).toISOString(),
    read: true
  }
];

/**
 * Get chat history for a user
 */
export function getChatHistory(userId: string): ChatMessage[] {
  // In a real app, we'd fetch from Firestore based on userId
  return [...mockChatHistory];
}

/**
 * Add message to chat history
 */
export function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const newMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  
  // In a real app, we'd save to Firestore
  console.log('Message added:', newMessage);
  
  return newMessage;
}

/**
 * Get AI response to user message
 * 
 * This is a mock implementation that simulates calling an API
 */
export async function getAIResponse(message: string): Promise<string> {
  // In a real app, this would call OpenAI API
  console.log('Getting AI response for:', message);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses based on keywords
  if (message.toLowerCase().includes('goal') || message.toLowerCase().includes('smart')) {
    return "Goals are important for business success. Make sure they're SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. Need help setting specific goals for your business?";
  }
  
  if (message.toLowerCase().includes('marketing') || message.toLowerCase().includes('customer')) {
    return "Marketing is crucial for business growth. Consider focusing on your target audience, clear messaging, and consistent branding. Would you like specific marketing strategies for your business type?";
  }

  if (message.toLowerCase().includes('finance') || message.toLowerCase().includes('money') || message.toLowerCase().includes('cash')) {
    return "Financial management is the foundation of a sustainable business. Start with separating personal and business finances, tracking all expenses, and regularly reviewing your cash flow. Would you like help with specific financial challenges?";
  }
  
  // Default response
  return "I understand you need assistance. Could you please provide more details about your specific business challenge or question? I'm here to help with marketing, finance, goal setting, team management, and other business topics.";
}
```

2. Create `/hooks/useChat.ts` for managing chat functionality:

```typescript
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
```

3. Create `/components/features/chat/ChatTabs.tsx`:

```typescript
/**
 * @file ChatTabs.tsx
 * @description Tabs for switching between different chat types
 */

import React from 'react';
import { Users, MessageSquare, Bot } from 'lucide-react';
import { ChatType } from '@/hooks/useChat';

interface ChatTabsProps {
  activeTab: ChatType;
  onChange: (tab: ChatType) => void;
}

/**
 * ChatTabs component
 * 
 * Provides tabs for switching between different chat types
 */
export function ChatTabs({ activeTab, onChange }: ChatTabsProps) {
  const tabs = [
    {
      id: 'group' as ChatType,
      label: 'Group Chat (Telegram)',
      icon: <Users className="w-4 h-4 mr-2" />,
      description: 'Join our BizLevel community group.'
    },
    {
      id: 'tracker' as ChatType,
      label: 'Tracker Chat',
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
      description: 'Chat with your learning tracker.'
    },
    {
      id: 'ai-bot' as ChatType,
      label: 'AI-Bot Chat',
      icon: <Bot className="w-4 h-4 mr-2" />,
      description: 'Get immediate answers from our AI assistant.'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex-1 min-w-[150px] p-4 rounded-lg cursor-pointer transition-colors
            ${activeTab === tab.id 
              ? 'bg-teal-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
          `}
        >
          <div className="flex items-center">
            {tab.icon}
            <span>{tab.label}</span>
          </div>
          {activeTab === tab.id && (
            <p className="text-xs mt-1 text-white">
              {tab.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

4. Create `/components/features/chat/MessageBubble.tsx`:

```typescript
/**
 * @file MessageBubble.tsx
 * @description Component for displaying a chat message
 */

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage, MessageSender } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * MessageBubble component
 * 
 * Displays a single chat message with sender info and timestamp
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === MessageSender.USER;
  
  // Format message text with line breaks
  const formattedText = message.text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
  
  // Format timestamp
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { 
    addSuffix: true 
  });
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src={isUser ? undefined : "/icons/bot-avatar.png"} />
          <AvatarFallback className={isUser ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}>
            {isUser ? 'U' : 'B'}
          </AvatarFallback>
        </Avatar>
        
        {/* Message bubble */}
        <div 
          className={`mx-2 py-2 px-4 rounded-lg ${
            isUser 
              ? 'bg-teal-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-line">{formattedText}</p>
          <div className={`text-xs mt-1 ${isUser ? 'text-teal-100' : 'text-gray-500'}`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
```

5. Create `/components/features/chat/MessageInput.tsx`:

```typescript
/**
 * @file MessageInput.tsx
 * @description Component for inputting and sending chat messages
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

/**
 * MessageInput component
 * 
 * Allows users to type and send chat messages
 */
export function MessageInput({ 
  onSend, 
  isDisabled = false,
  placeholder = 'Type your message...' 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Handle send button click
  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSend(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle key press (Ctrl+Enter or Cmd+Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="border rounded-lg p-2 flex items-end">
      <Textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        className="flex-grow resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[200px]"
      />
      <div className="flex space-x-2 ml-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isDisabled}
          className="h-9 w-9 rounded-full"
          title="Attach file (coming soon)"
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>
        <Button
          type="button"
          size="icon"
          disabled={isDisabled || !message.trim()}
          className="h-9 w-9 rounded-full"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
```

6. Create `/components/features/chat/MessageList.tsx`:

```typescript
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
```

7. Update `/app/(main)/chat/page.tsx`:

```typescript
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
```

8. Create `/components/ui/textarea.tsx`:

```
npx shadcn-ui@latest add textarea
```

## Expected Output

```
- Chat interface files:
  - /lib/data/chat-history.ts (Mock chat data)
  - /hooks/useChat.ts (Hook for chat functionality)
  - /components/features/chat/ChatTabs.tsx (Chat type selector)
  - /components/features/chat/MessageBubble.tsx (Message display)
  - /components/features/chat/MessageInput.tsx (Message input component)
  - /components/features/chat/MessageList.tsx (Message history display)
  - /components/ui/textarea.tsx (Textarea component)
  - /app/(main)/chat/page.tsx (Updated chat page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Chat interface implementation

   ## Recently Completed
   - Task 1.1: Initialize Next.js Project with TypeScript, Tailwind, and shadcn/ui
   - Task 1.2: Create TypeScript Type Definitions for all data models
   - Task 1.3: Set up Firebase Configuration and utilities
   - Task 1.4: Create Authentication Context and Hooks
   - Task 1.5: Build Authentication Pages
   - Task 2.1: Implement Main Layout
   - Task 2.2: Build Level Map Component
   - Task 2.3: Implement Profile Page
   - Task 2.4: Build Level Detail Page
   - Task 3.1: Implement Artifacts System
   - Task 3.2: Implement Chat Interface

   ## Current Issues
   - None

   ## Next Up
   - Task 3.3: Implement Settings Page

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/chat.md` with a description of the chat system:
   ```markdown
   # Chat System

   ## Overview
   This document describes the chat system, which provides users with AI assistant help, group chat access, and tracker communication.

   ## Components

   ### 1. ChatTabs
   - Allows switching between different chat types
   - Provides visual indication of the active chat type
   - Shows description of the selected chat option

   ### 2. MessageBubble
   - Displays individual chat messages
   - Differentiates between user and bot messages with styling
   - Shows sender avatar and message timestamp
   - Formats message text with proper line breaks

   ### 3. MessageInput
   - Provides text input for typing messages
   - Auto-expands based on content length
   - Includes send button and attachment placeholder
   - Supports keyboard shortcuts (Ctrl/Cmd + Enter)

   ### 4. MessageList
   - Displays scrollable message history
   - Auto-scrolls to new messages
   - Shows loading state and empty state
   - Ordered chronologically

   ## Chat Types

   ### AI Assistant Chat
   - Instant AI responses to user questions
   - Context-aware assistance based on learning progress
   - Handles business-related inquiries and learning questions
   - Simulated in MVP, will use OpenAI API in production

   ### Group Chat
   - Community discussion space (via Telegram in production)
   - Placeholder in MVP version
   - Will connect users to a shared learning community

   ### Tracker Chat
   - Direct communication with learning tracker/coach
   - Placeholder in MVP version
   - Will provide personalized guidance in production

   ## Data Management

   ### useChat Hook
   - Manages chat state and functionality
   - Handles message sending and receiving
   - Switches between different chat types
   - Tracks loading and error states
   - Simulates AI responses in MVP

   ## Implementation Details
   - React components with TypeScript
   - Flexible chat interface for different chat types
   - Mock AI responses based on keywords
   - Responsive design for different screen sizes
   - Will integrate with OpenAI API and Telegram in production
   ```

3. Create a snapshot document at `/docs/snapshots/chat.md`:
   ```markdown
   # Chat System Snapshot

   ## Purpose
   Provide a messaging interface for AI assistance, group discussion, and tracker communication

   ## Key Files
   - `/lib/data/chat-history.ts` - Mock chat data
   - `/hooks/useChat.ts` - Hook for chat functionality
   - `/components/features/chat/ChatTabs.tsx` - Chat type selector
   - `/components/features/chat/MessageBubble.tsx` - Message display
   - `/components/features/chat/MessageInput.tsx` - Message input component
   - `/components/features/chat/MessageList.tsx` - Message history display
   - `/app/(main)/chat/page.tsx` - Chat page

   ## State Management
   - Chat history and messages stored in local state
   - Chat type selection controls which chat is displayed
   - Message sending simulated with mock responses
   - Loading and error states managed for UX

   ## Data Flow
   1. useChat hook loads message history and manages state
   2. User selects chat type (AI, group, tracker)
   3. User enters and sends messages
   4. Hook processes message and generates response
   5. New messages are added to the chat history
   6. UI updates to show the conversation

   ## Key Decisions
   - Tabbed interface for different chat types
   - Asynchronous message handling with loading states
   - Auto-expanding input field for better UX
   - Visual distinction between user and bot messages

   ## Usage Example
   ```tsx
   import { useChat } from '@/hooks/useChat';
   import { MessageList } from '@/components/features/chat/MessageList';
   import { MessageInput } from '@/components/features/chat/MessageInput';

   function ChatInterface() {
     const { messages, isSending, sendMessage } = useChat('ai-bot');
     
     return (
       <div className="flex flex-col h-full">
         <MessageList messages={messages} />
         <MessageInput 
           onSend={sendMessage} 
           isDisabled={isSending} 
         />
       </div>
     );
   }
   ```

   ## Known Issues
   - AI responses are simulated with basic keyword matching
   - Group and tracker chats are placeholders
   - No persistent message storage between sessions
   ```

## Testing Instructions

1. Test the chat interface:
   - Run the development server
   - Navigate to the chat page
   - Verify that the chat interface loads with tabs and message history
   - Check that the default AI-Bot chat tab is selected

2. Test message sending and receiving:
   - Type a message in the input field
   - Send the message using the send button
   - Verify that the message appears in the chat
   - Check that the AI responds with a relevant message
   - Test sending multiple messages

3. Test chat type switching:
   - Click on different chat tabs (Group Chat, Tracker Chat)
   - Verify that the interface updates with the correct description
   - Test sending messages in different chat types
   - Verify that appropriate placeholder responses are shown

4. Test UI components:
   - Test auto-expanding input field with long messages
   - Check that messages are displayed correctly with avatars and timestamps
   - Verify that the chat scrolls to new messages
   - Test responsive design on different screen sizes

5. Test edge cases:
   - Try sending empty messages (should be prevented)
   - Test with very long messages
   - Test keyboard shortcuts (Ctrl/Cmd + Enter)
   - Verify loading and error states
