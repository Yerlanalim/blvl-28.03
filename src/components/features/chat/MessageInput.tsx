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