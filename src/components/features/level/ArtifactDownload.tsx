/**
 * @file ArtifactDownload.tsx
 * @description Component for downloading artifacts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Check, FileText, File } from 'lucide-react';
import { LevelArtifact } from '@/types';

interface ArtifactDownloadProps {
  artifact: LevelArtifact;
  isDownloaded: boolean;
  onDownload: () => void;
}

/**
 * ArtifactDownload component
 * 
 * Displays an artifact with download button
 */
export function ArtifactDownload({ 
  artifact, 
  isDownloaded, 
  onDownload 
}: ArtifactDownloadProps) {
  const handleDownload = () => {
    // In a real app, this would download the actual file
    // For demo purposes, we'll just trigger the onDownload callback
    onDownload();
    
    // Simulate opening the file in a new tab
    window.open(artifact.fileUrl, '_blank');
  };
  
  // Determine icon based on file type
  const getFileIcon = () => {
    switch (artifact.fileType) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />;
      case 'spreadsheet':
        return <File className="w-5 h-5 text-green-500" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };
  
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {getFileIcon()}
          <span>{artifact.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{artifact.description}</p>
        
        <Button
          onClick={handleDownload}
          variant={isDownloaded ? "outline" : "default"}
          className={`w-full ${isDownloaded ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700' : ''}`}
          size="sm"
        >
          {isDownloaded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Скачано
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Скачать материал
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 