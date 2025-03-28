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

// Counter for generating unique message IDs
let messageCounter = 0;

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
  // Increment counter to ensure unique IDs even if messages are added in the same millisecond
  messageCounter++;
  
  const newMessage = {
    ...message,
    id: `msg-${Date.now()}-${messageCounter}`,
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