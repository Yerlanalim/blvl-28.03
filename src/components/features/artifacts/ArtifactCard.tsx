/**
 * @file ArtifactCard.tsx
 * @description Card component for displaying artifact information
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileIcon, 
  DownloadIcon, 
  CheckIcon, 
  ExternalLinkIcon
} from 'lucide-react';
import { ArtifactWithMeta } from '@/hooks/useArtifacts';

interface ArtifactCardProps {
  artifact: ArtifactWithMeta;
  onDownload: () => void;
}

/**
 * ArtifactCard component
 * 
 * Displays an artifact with download button and related level
 */
export function ArtifactCard({ artifact, onDownload }: ArtifactCardProps) {
  // Determine icon based on file type
  const getFileIcon = () => {
    switch (artifact.fileType) {
      case 'pdf':
        return <FileIcon className="w-5 h-5 text-red-500" />;
      case 'spreadsheet':
        return <FileIcon className="w-5 h-5 text-green-500" />;
      case 'doc':
        return <FileIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  const handleDownload = () => {
    // Trigger the download
    onDownload();
    
    // Simulate opening the file in a new tab
    window.open(artifact.fileUrl, '_blank');
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            {getFileIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{artifact.title}</h3>
            <p className="text-gray-600 mt-1">{artifact.description}</p>
            <p className="text-sm text-gray-500 mt-3">
              From Level {artifact.levelOrder}: {artifact.levelTitle}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleDownload}
          variant={artifact.isDownloaded ? "outline" : "default"}
          className={artifact.isDownloaded ? 'bg-green-50 text-green-700 border-green-200' : ''}
        >
          {artifact.isDownloaded ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Downloaded
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
        
        <Link href={`/level/${artifact.levelId}`}>
          <Button variant="outline">
            Go to Related Lesson
            <ExternalLinkIcon className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 