/**
 * @file page.tsx
 * @description Страница FAQ с категоризированными вопросами и поиском
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
  
  // Получение текущей категории
  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.id === activeCategory) || categories[0];
  }, [categories, activeCategory]);
  
  // Получение элементов для отображения (из поиска или выбранной категории)
  const displayItems = useMemo(() => {
    if (searchQuery) {
      return searchFAQItems(searchQuery);
    }
    
    return currentCategory?.items || [];
  }, [searchQuery, currentCategory]);
  
  // Обработка изменения категории
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Очистка поиска при изменении категории
  };
  
  // Обработка поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Часто задаваемые вопросы</h1>
        <p className="text-gray-600 mt-1">Найдите ответы на распространенные вопросы о BizLevel.</p>
      </div>
      
      {/* Поисковая строка */}
      <FAQSearch onSearch={handleSearch} />
      
      {/* Вкладки категорий */}
      <FAQCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        isSearchActive={!!searchQuery}
      />
      
      {/* Описание категории (показывается только когда нет поиска) */}
      {!searchQuery && currentCategory && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentCategory.title}</CardTitle>
            <CardDescription>{currentCategory.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {/* Информация о результатах поиска (показывается только при поиске) */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Найдено {displayItems.length} результатов для "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* Аккордеон FAQ */}
      <FAQAccordion items={displayItems} />
      
      {/* Блок дополнительной помощи */}
      <div className="mt-12 text-center py-6 border-t">
        <h2 className="text-lg font-semibold mb-2">Всё ещё нужна помощь?</h2>
        <p className="text-gray-600 mb-4">
          Не нашли то, что искали? Свяжитесь с нами через чат или электронную почту.
        </p>
      </div>
    </div>
  );
} 