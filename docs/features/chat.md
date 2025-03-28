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