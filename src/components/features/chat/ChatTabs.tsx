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