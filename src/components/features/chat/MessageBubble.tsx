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