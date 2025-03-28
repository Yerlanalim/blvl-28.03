/**
 * @file page.tsx
 * @description Artifacts page for listing and downloading resources
 * @dependencies hooks/useArtifacts, components/features/artifacts/*
 */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useArtifacts, ArtifactWithMeta } from '@/hooks/useArtifacts';
import { ArtifactCard } from '@/components/features/artifacts/ArtifactCard';
import { ArtifactFilters } from '@/components/features/artifacts/ArtifactFilters';
import { ArtifactEmptyState } from '@/components/features/artifacts/ArtifactEmptyState';
import { ArtifactFileType } from '@/types';

export default function ArtifactsPage() {
  const { 
    artifacts, 
    loading, 
    error, 
    markArtifactDownloaded 
  } = useArtifacts();
  
  // Filter and search state
  const [fileTypeFilter, setFileTypeFilter] = useState<ArtifactFileType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filters to artifacts
  const filteredArtifacts = useMemo(() => {
    let result = [...artifacts];
    
    // Apply file type filter
    if (fileTypeFilter !== 'all') {
      result = result.filter(artifact => artifact.fileType === fileTypeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(artifact => 
        artifact.title.toLowerCase().includes(query) ||
        artifact.description.toLowerCase().includes(query) ||
        artifact.levelTitle.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [artifacts, fileTypeFilter, searchQuery]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading artifacts: {error.message}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Link href="/map" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to map</span>
        </Link>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold">Artifacts &amp; Resources</h1>
        <p className="text-gray-600 mt-1">All your course resources in one place.</p>
      </div>

      {/* Filters */}
      <ArtifactFilters
        onFilterChange={setFileTypeFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Artifacts list */}
      <div className="space-y-6">
        {filteredArtifacts.length > 0 ? (
          filteredArtifacts.map(artifact => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onDownload={() => markArtifactDownloaded(artifact.id)}
            />
          ))
        ) : (
          <ArtifactEmptyState message={
            searchQuery 
              ? `No artifacts found matching "${searchQuery}"`
              : `No ${fileTypeFilter !== 'all' ? fileTypeFilter : ''} artifacts found`
          } />
        )}
      </div>
      
      {/* Helper text */}
      <div className="text-center text-gray-500 text-sm pt-4 border-t">
        Need more tools? Check the <Link href="/chat" className="text-teal-600 hover:text-teal-700">Chat</Link> or <Link href="/faq" className="text-teal-600 hover:text-teal-700">FAQ</Link>
      </div>
    </div>
  );
} 