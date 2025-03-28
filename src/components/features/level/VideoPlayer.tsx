/**
 * @file VideoPlayer.tsx
 * @description YouTube video player component for level content
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Check, CheckCircle } from 'lucide-react';
import { Video, VideoProgress } from '@/types';

interface VideoPlayerProps {
  video: Video;
  progress: VideoProgress;
  onVideoComplete: () => void;
  onPositionChange: (position: number) => void;
}

/**
 * VideoPlayer component
 * 
 * Displays a YouTube video with progress tracking
 */
export function VideoPlayer({ 
  video,
  progress,
  onVideoComplete,
  onPositionChange
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(progress?.position || 0);
  const playerRef = useRef<HTMLIFrameElement>(null);
  
  // For simplicity in this prototype, we're using a basic player
  // In a real app, we would use the YouTube IFrame API for more control
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    // Simulate position tracking
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentPosition(prev => {
          const newPosition = prev + 1;
          onPositionChange(newPosition);
          
          // Auto-mark as watched at 90% completion
          if (video.duration > 0 && newPosition >= video.duration * 0.9 && !progress.watched) {
            clearInterval(interval);
            onVideoComplete();
          }
          
          return newPosition;
        });
      }, 1000);
      
      // Store interval ID for cleanup
      return () => clearInterval(interval);
    }
  };
  
  // Generate YouTube embed URL
  const youtubeUrl = `https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0`;
  
  // Calculate progress percentage
  const progressPercentage = video.duration > 0 
    ? Math.min(100, Math.round((currentPosition / video.duration) * 100)) 
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>{video.title}</span>
          {progress?.watched && (
            <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Просмотрено
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video w-full bg-black relative">
          <iframe
            ref={playerRef}
            src={youtubeUrl}
            className="w-full h-full"
            allowFullScreen
            title={video.title}
          />
        </div>
        
        <div className="p-4 space-y-3">
          <p className="text-muted-foreground text-sm">{video.description}</p>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Прогресс</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={togglePlayback}
              className="flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Пауза' : 'Смотреть'}
            </Button>
            
            {!progress?.watched && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onVideoComplete}
                className="text-green-600"
              >
                <Check className="w-4 h-4 mr-1" />
                Отметить просмотренным
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 