# Task 3.4: Create FAQ Page

## Task Details

```
Task: Implement FAQ page for common questions
Reference: Page Routes section in project description
Context: Users need easy access to common information
Current Files:
- /app/(main)/faq/page.tsx (FAQ page placeholder)
Previous Decision: Create an FAQ page with expandable sections and categories
```

## Context Recovery Steps

1. Review the project description document, particularly the Page Routes section:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the FAQ page placeholder:
   ```bash
   cat app/\(main\)/faq/page.tsx
   ```

## Implementation Steps

```
1. Create `/lib/data/faq-data.ts` with FAQ content:

```typescript
/**
 * @file faq-data.ts
 * @description FAQ data organized by categories
 */

// FAQ item interface
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// FAQ category interface
export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
}

/**
 * FAQ data organized by categories
 */
export const faqData: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Basic information about using BizLevel',
    items: [
      {
        id: 'what-is-bizlevel',
        question: 'What is BizLevel?',
        answer: 'BizLevel is an online educational platform designed to help entrepreneurs and managers improve their business skills through short videos, interactive tests, and practical artifacts (templates, checklists, etc.). The platform features a gamified learning path with levels that unlock progressively as you complete the content.'
      },
      {
        id: 'how-to-start',
        question: 'How do I get started?',
        answer: 'After signing up, you\'ll be directed to the Level Map where you can start with Level 1. Each level contains short video lessons (2-4 minutes each), interactive quizzes, and downloadable artifacts that you can apply to your business. Complete all the elements of a level to unlock the next one.'
      },
      {
        id: 'account-creation',
        question: 'How do I create an account?',
        answer: 'Click the "Register" button on the login page and fill out the registration form. You\'ll need to provide your name, email address, and create a password. Optionally, you can also add information about your business during registration or later in your profile.'
      }
    ]
  },
  {
    id: 'levels-progress',
    title: 'Levels and Progress',
    description: 'Information about levels, progress tracking, and unlocking content',
    items: [
      {
        id: 'unlock-levels',
        question: 'How do I unlock new levels?',
        answer: 'To unlock a new level, you need to complete the previous level. Completion requires watching all videos, completing any tests or quizzes, and downloading the level artifacts. Once you\'ve completed all requirements, click the "Complete Level" button to unlock the next level.'
      },
      {
        id: 'track-progress',
        question: 'How is my progress tracked?',
        answer: 'Your progress is tracked automatically as you interact with the content. The system records which videos you\'ve watched, tests you\'ve completed, and artifacts you\'ve downloaded. You can view your overall progress in your Profile page, which shows completed levels and skill development across six business competency areas.'
      },
      {
        id: 'continue-where-left',
        question: 'Can I continue where I left off?',
        answer: 'Yes! BizLevel remembers your progress, so you can always continue where you left off. When you return to the platform, navigate to the Level Map and you\'ll see your current level highlighted. Click on it to resume your learning journey.'
      }
    ]
  },
  {
    id: 'artifacts-resources',
    title: 'Artifacts and Resources',
    description: 'Information about downloadable materials and resources',
    items: [
      {
        id: 'what-are-artifacts',
        question: 'What are artifacts?',
        answer: 'Artifacts are practical resources that help you apply what you\'ve learned to your business. These include templates, checklists, spreadsheets, and PDF guides. Each level includes at least one artifact that complements the video content and helps you implement the strategies discussed.'
      },
      {
        id: 'download-artifacts',
        question: 'How do I download artifacts?',
        answer: 'Artifacts can be downloaded directly from the level page by clicking the "Download Artifact" button. You can also access all artifacts from the Artifacts page in the main navigation, where you can search and filter all available resources.'
      },
      {
        id: 'missing-artifacts',
        question: 'What if I can\'t open an artifact?',
        answer: 'Artifacts are provided in common formats like PDF, Excel spreadsheets, and Word documents. If you\'re having trouble opening an artifact, make sure you have the appropriate software installed (such as Adobe Reader for PDFs or Microsoft Office/Google Docs for spreadsheets and documents). If you continue to have issues, contact support through the Chat feature.'
      }
    ]
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    description: 'Help with technical issues and platform functionality',
    items: [
      {
        id: 'video-not-playing',
        question: 'What should I do if videos are not playing?',
        answer: 'If you\'re having trouble playing videos, try the following: 1) Check your internet connection, 2) Clear your browser cache, 3) Try using a different browser, 4) Ensure JavaScript is enabled in your browser, 5) Disable any ad-blockers or extensions that might be interfering with video playback. If problems persist, contact us through the Chat feature.'
      },
      {
        id: 'reset-password',
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on "Forgot password?" on the login page. Enter your email address, and we\'ll send you a password reset link. Click the link in the email and follow the instructions to create a new password. Alternatively, you can change your password in the Settings page if you\'re already logged in.'
      },
      {
        id: 'browser-compatibility',
        question: 'Which browsers are supported?',
        answer: 'BizLevel works best with modern browsers like Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. For the best experience, we recommend using the latest version of these browsers. If you\'re experiencing issues, try updating your browser to the latest version.'
      }
    ]
  },
  {
    id: 'account-billing',
    title: 'Account and Billing',
    description: 'Information about accounts, subscriptions, and payments',
    items: [
      {
        id: 'free-vs-premium',
        question: 'What\'s the difference between free and premium access?',
        answer: 'The free access includes the first three levels of content, allowing you to experience the platform\'s features and learning approach. Premium access unlocks all 10 levels, giving you the complete learning path and all artifacts. Premium users also get priority support and access to exclusive content updates.'
      },
      {
        id: 'update-account',
        question: 'How do I update my account information?',
        answer: 'You can update your account information in the Settings page. Click on "Settings" in the main navigation, then click "Edit" in the Account Information section. Here you can update your username, email, and other details. Don\'t forget to click "Save Changes" when you\'re done.'
      },
      {
        id: 'cancel-subscription',
        question: 'Can I cancel my subscription?',
        answer: 'Yes, you can cancel your subscription at any time. Go to the Settings page, navigate to the Subscription section, and click "Cancel Subscription". Your access will continue until the end of your current billing period. After cancellation, you\'ll still have access to free content, but premium levels will be locked.'
      }
    ]
  }
];

/**
 * Get all FAQ categories
 */
export function getFAQCategories(): FAQCategory[] {
  return faqData;
}

/**
 * Get FAQ items by category ID
 */
export function getFAQItemsByCategory(categoryId: string): FAQItem[] {
  const category = faqData.find(cat => cat.id === categoryId);
  return category ? category.items : [];
}

/**
 * Search FAQ items
 */
export function searchFAQItems(query: string): FAQItem[] {
  const normalizedQuery = query.toLowerCase();
  
  const results: FAQItem[] = [];
  
  faqData.forEach(category => {
    category.items.forEach(item => {
      if (
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery)
      ) {
        results.push(item);
      }
    });
  });
  
  return results;
}
```

2. Create `/components/features/faq/FAQAccordion.tsx`:

```typescript
/**
 * @file FAQAccordion.tsx
 * @description Accordion component for displaying FAQ items
 */

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQItem } from '@/lib/data/faq-data';

interface FAQAccordionProps {
  items: FAQItem[];
  defaultValue?: string;
}

/**
 * FAQAccordion component
 * 
 * Displays FAQ items in an expandable accordion
 */
export function FAQAccordion({ items, defaultValue }: FAQAccordionProps) {
  // If no items, show message
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-gray-500">No FAQ items found.</p>
      </div>
    );
  }
  
  return (
    <Accordion type="single" collapsible defaultValue={defaultValue}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none">
              <p>{item.answer}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

3. Create `/components/features/faq/FAQSearch.tsx`:

```typescript
/**
 * @file FAQSearch.tsx
 * @description Search component for filtering FAQ items
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

/**
 * FAQSearch component
 * 
 * Provides search functionality for FAQ items
 */
export function FAQSearch({ onSearch }: FAQSearchProps) {
  const [query, setQuery] = useState('');
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Trigger search after short delay (debounce)
    const handler = setTimeout(() => {
      onSearch(newQuery);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>
      
      <Input
        type="search"
        placeholder="Search FAQs..."
        value={query}
        onChange={handleInputChange}
        className="pl-10 pr-10"
      />
      
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 px-3"
          onClick={clearSearch}
        >
          <XIcon className="w-5 h-5 text-gray-400" />
        </Button>
      )}
    </div>
  );
}
```

4. Create `/components/features/faq/FAQCategoryTabs.tsx`:

```typescript
/**
 * @file FAQCategoryTabs.tsx
 * @description Tabs for filtering FAQ items by category
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FAQCategory } from '@/lib/data/faq-data';

interface FAQCategoryTabsProps {
  categories: FAQCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isSearchActive?: boolean;
}

/**
 * FAQCategoryTabs component
 * 
 * Displays tabs for each FAQ category
 */
export function FAQCategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  isSearchActive = false
}: FAQCategoryTabsProps) {
  return (
    <Tabs value={isSearchActive ? 'search-results' : activeCategory} className="mb-6">
      <TabsList className="w-full justify-start overflow-x-auto space-x-2">
        {isSearchActive && (
          <TabsTrigger 
            value="search-results"
            className="py-2 px-4"
          >
            Search Results
          </TabsTrigger>
        )}
        
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="py-2 px-4"
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

5. Create `/components/ui/accordion.tsx` and `/components/ui/tabs.tsx`:

```
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add tabs
```

6. Update `/app/(main)/faq/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description FAQ page with categorized questions and search
 * @dependencies components/features/faq/*, lib/data/faq-data
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  getFAQCategories, 
  searchFAQItems,
  FAQCategory,
  FAQItem
} from '@/lib/data/faq-data';
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import { FAQSearch } from '@/components/features/faq/FAQSearch';
import { FAQCategoryTabs } from '@/components/features/faq/FAQCategoryTabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const categories = getFAQCategories();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get current category
  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.id === activeCategory) || categories[0];
  }, [categories, activeCategory]);
  
  // Get items to display (either from search or selected category)
  const displayItems = useMemo(() => {
    if (searchQuery) {
      return searchFAQItems(searchQuery);
    }
    
    return currentCategory?.items || [];
  }, [searchQuery, currentCategory]);
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        <p className="text-gray-600 mt-1">Find answers to common questions about BizLevel.</p>
      </div>
      
      {/* Search bar */}
      <FAQSearch onSearch={handleSearch} />
      
      {/* Category tabs */}
      <FAQCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        isSearchActive={!!searchQuery}
      />
      
      {/* Category description (shown only when not searching) */}
      {!searchQuery && currentCategory && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentCategory.title}</CardTitle>
            <CardDescription>{currentCategory.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {/* Search results info (shown only when searching) */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Found {displayItems.length} results for "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* FAQ accordion */}
      <FAQAccordion items={displayItems} />
      
      {/* More help section */}
      <div className="mt-12 text-center py-6 border-t">
        <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Contact us through the chat or email.
        </p>
      </div>
    </div>
  );
}
```

## Expected Output

```
- FAQ page files:
  - /lib/data/faq-data.ts (FAQ content data)
  - /components/features/faq/FAQAccordion.tsx (Expandable FAQ items)
  - /components/features/faq/FAQSearch.tsx (Search functionality)
  - /components/features/faq/FAQCategoryTabs.tsx (Category navigation)
  - /components/ui/accordion.tsx (Accordion component)
  - /components/ui/tabs.tsx (Tabs component)
  - /app/(main)/faq/page.tsx (Updated FAQ page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - FAQ page implementation

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
   - Task 3.3: Implement Settings Page
   - Task 3.4: Create FAQ Page

   ## Current Issues
   - None

   ## Next Up
   - Task 4.1: Implement Progress Tracking System

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Complete (Artifact listing, filtering, and download tracking)
   - Chat: Complete (Chat interface with AI assistant)
   - Settings: Complete (Account settings, preferences, and notifications)
   - FAQ: Complete (Categorized FAQs with search functionality)
   ```

2. Create `/docs/features/faq.md` with a description of the FAQ system:
   ```markdown
   # FAQ System

   ## Overview
   This document describes the FAQ system, which provides users with answers to common questions organized by categories with search functionality.

   ## Components

   ### 1. FAQAccordion
   - Expandable accordion for displaying FAQ items
   - Shows question as trigger and answer as content
   - Supports default open state for specific items
   - Uses shadcn/ui Accordion component

   ### 2. FAQSearch
   - Search bar for finding specific questions or answers
   - Debounced input for better performance
   - Clear button for resetting search
   - Real-time filtering of FAQ items

   ### 3. FAQCategoryTabs
   - Tab navigation for different FAQ categories
   - Visual indication of active category
   - Special tab for search results when searching
   - Uses shadcn/ui Tabs component

   ## Data Management

   ### FAQ Data Structure
   - Organized by categories with descriptive titles
   - Each category contains multiple FAQ items
   - Each FAQ item has a unique ID, question, and answer
   - Searchable content across all categories

   ### Search Functionality
   - Case-insensitive search across questions and answers
   - Real-time filtering as the user types
   - Clear visual indication of search results
   - Easy way to clear search and return to categories

   ## User Interactions

   ### Category Navigation
   - Users can browse FAQs by predefined categories
   - Clicking a category tab shows relevant questions
   - Category description provides context
   - Responsive tabs for all screen sizes

   ### Question Expansion
   - Users can click questions to expand answers
   - Accordion allows only one question open at a time
   - Collapsed state keeps the interface clean
   - Expanded state shows the full answer

   ### Search Experience
   - Users can search across all FAQ content
   - Results show all matching questions
   - Clear indication of search result count
   - Easy return to category browsing

   ## Implementation Details
   - React components with TypeScript
   - Responsive design for mobile and desktop
   - Optimized search with debouncing
   - Accessible accordion and tab components
   - Clean separation of data and presentation
   ```

3. Create a snapshot document at `/docs/snapshots/faq.md`:
   ```markdown
   # FAQ System Snapshot

   ## Purpose
   Provide organized access to common questions and answers with search functionality

   ## Key Files
   - `/lib/data/faq-data.ts` - FAQ content data
   - `/components/features/faq/FAQAccordion.tsx` - Expandable FAQ items
   - `/components/features/faq/FAQSearch.tsx` - Search functionality
   - `/components/features/faq/FAQCategoryTabs.tsx` - Category navigation
   - `/app/(main)/faq/page.tsx` - FAQ page

   ## State Management
   - Active category tracked in page state
   - Search query with debounced updates
   - Computed display items based on search or category
   - Tab state connected to category selection

   ## Data Flow
   1. User selects category or enters search query
   2. Page state updates (active category or search query)
   3. Display items are computed based on current state
   4. UI components render the filtered items
   5. User can expand/collapse individual questions

   ## Key Decisions
   - Category-based organization with tab navigation
   - Accordion interface for questions and answers
   - Real-time search across all content
   - Clear visual distinction between browsing and searching
   - Additional "Still need help?" section for unresolved questions

   ## Usage Example
   ```tsx
   import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
   import { getFAQItemsByCategory } from '@/lib/data/faq-data';

   function CategoryFAQs({ categoryId }) {
     const items = getFAQItemsByCategory(categoryId);
     
     return (
       <div>
         <h2>Frequently Asked Questions</h2>
         <FAQAccordion items={items} />
       </div>
     );
   }
   ```

   ## Known Issues
   - None at this time
   ```

## Testing Instructions

1. Test the FAQ page:
   - Run the development server
   - Navigate to the FAQ page
   - Verify that all categories and questions appear correctly
   - Check that the accordion functionality works (expand/collapse)

2. Test category navigation:
   - Click on different category tabs
   - Verify that the correct questions are displayed for each category
   - Check that the category description updates
   - Verify that the active tab is visually indicated

3. Test search functionality:
   - Enter search terms in the search bar
   - Verify that matching questions are displayed
   - Check that the search result count is accurate
   - Test clearing the search and returning to category view
   - Search for terms that appear in answers but not questions

4. Test responsive design:
   - Check the FAQ page on different screen sizes
   - Verify that the tabs are scrollable on mobile
   - Ensure that questions and answers are readable on small screens
   - Test search functionality on mobile devices

5. Test edge cases:
   - Search for non-existent terms
   - Try expanding multiple questions (should collapse others)
   - Test very long questions and answers
   - Verify tab behavior with many categories
