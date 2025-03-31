/**
 * @file FAQSearch.tsx
 * @description Компонент поиска для фильтрации элементов FAQ
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

/**
 * Компонент FAQSearch
 * 
 * Предоставляет функциональность поиска для элементов FAQ
 */
export function FAQSearch({ onSearch }: FAQSearchProps) {
  const [query, setQuery] = useState('');
  
  // Обработка изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Запуск поиска после короткой задержки (debounce)
    const handler = setTimeout(() => {
      onSearch(newQuery);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  };
  
  // Очистка поиска
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
        placeholder="Поиск в FAQ..."
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