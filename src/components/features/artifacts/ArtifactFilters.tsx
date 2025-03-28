/**
 * @file ArtifactFilters.tsx
 * @description Component for filtering and searching artifacts
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArtifactFileType } from '@/types';
import { SearchIcon, FileIcon, XIcon } from 'lucide-react';

interface ArtifactFiltersProps {
  onFilterChange: (fileType: ArtifactFileType | 'all') => void;
  onSearchChange: (query: string) => void;
}

/**
 * ArtifactFilters component
 * 
 * Provides search and filter controls for artifacts
 */
export function ArtifactFilters({ 
  onFilterChange, 
  onSearchChange 
}: ArtifactFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<ArtifactFileType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle filter button click
  const handleFilterClick = (filter: ArtifactFileType | 'all') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  // File type filters
  const filters = [
    { label: 'All', value: 'all' as const },
    { label: 'PDF', value: 'pdf' as ArtifactFileType },
    { label: 'Spreadsheet', value: 'spreadsheet' as ArtifactFileType },
    { label: 'Document', value: 'doc' as ArtifactFileType }
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search artifacts..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={handleSearchInput}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(filter.value)}
            className={activeFilter === filter.value ? '' : 'text-gray-700'}
          >
            {filter.value !== 'all' && (
              <FileIcon className={`h-4 w-4 mr-2 ${
                filter.value === 'pdf' ? 'text-red-500' :
                filter.value === 'spreadsheet' ? 'text-green-500' :
                filter.value === 'doc' ? 'text-blue-500' : ''
              }`} />
            )}
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 