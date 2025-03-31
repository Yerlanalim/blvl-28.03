/**
 * @file FAQCategoryTabs.tsx
 * @description Вкладки для фильтрации элементов FAQ по категориям
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
 * Компонент FAQCategoryTabs
 * 
 * Отображает вкладки для каждой категории FAQ
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
            Результаты поиска
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