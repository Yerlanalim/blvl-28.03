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
- `/app/(routes)/chat/page.tsx` - Chat page

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