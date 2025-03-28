# Task 2.4: Build Level Detail Page

## Task Details

```
Task: Create individual level page with videos and tests
Reference: Level Progression System and UI Reference (Image 4) in project description
Context: This is where users consume the learning content
Current Files:
- /types/Level.ts (Level type definitions)
- /types/Progress.ts (Progress tracking types)
- /hooks/useLevels.ts (Level data hook)
- /lib/data/levels.ts (Mock level data)
- /lib/data/user-progress.ts (Mock progress data)
Previous Decision: Follow the UI design in Image 4 with video player, artifacts, and completion button
```

## Context Recovery Steps

1. Review the project description document, particularly the Level Detail Page section in UI Reference:
   ```bash
   cat docs/project-description.md
   ```

2. Check the current project status:
   ```bash
   cat status.md
   ```

3. Examine the Level and Progress type definitions:
   ```bash
   cat types/Level.ts
   cat types/Progress.ts
   ```

4. Review the level and progress hooks/data:
   ```bash
   cat hooks/useLevels.ts
   cat lib/data/levels.ts
   cat lib/data/user-progress.ts
   ```

## Implementation Steps

```
1. Create `/hooks/useLevel.ts` for managing individual level data:

```typescript
/**
 * @file useLevel.ts
 * @description Hook for accessing individual level data and progress
 * @dependencies hooks/useLevels, lib/data/levels, lib/data/user-progress
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Level, VideoProgress, TestProgress, LevelStatus } from '@/types';
import { getLevelById } from '@/lib/data/levels';
import { 
  getUserProgress, 
  isVideoWatched, 
  isTestCompleted, 
  isArtifactDownloaded, 
  mockVideoProgress 
} from '@/lib/data/user-progress';

/**
 * Hook for accessing and managing individual level data
 */
export function useLevel(levelId: string) {
  const { user } = useAuth();
  const [level, setLevel] = useState<Level | null>(null);
  const [levelStatus, setLevelStatus] = useState<LevelStatus>(LevelStatus.LOCKED);
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [testProgress, setTestProgress] = useState<Record<string, boolean>>({});
  const [artifactDownloaded, setArtifactDownloaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch level data and progress
  useEffect(() => {
    if (!levelId) {
      setError(new Error('Level ID is required'));
      setLoading(false);
      return;
    }

    try {
      // Get level data
      const levelData = getLevelById(levelId);
      if (!levelData) {
        setError(new Error(`Level with ID ${levelId} not found`));
        setLoading(false);
        return;
      }
      
      setLevel(levelData);
      
      // Get user progress
      if (user) {
        const progress = getUserProgress(user.id);
        
        // Determine level status
        if (progress.completedLevels.includes(levelId)) {
          setLevelStatus(LevelStatus.COMPLETED);
        } else if (progress.currentLevel === levelId || levelData.order === 1) {
          setLevelStatus(LevelStatus.AVAILABLE);
        } else {
          setLevelStatus(LevelStatus.LOCKED);
        }
        
        // Initialize video progress
        const videoProgressMap: Record<string, VideoProgress> = {};
        levelData.videos.forEach(video => {
          const isWatched = isVideoWatched(video.id, progress);
          videoProgressMap[video.id] = mockVideoProgress.find(vp => vp.videoId === video.id) || {
            videoId: video.id,
            watched: isWatched,
            position: 0
          };
        });
        setVideoProgress(videoProgressMap);
        
        // Initialize test progress
        const testProgressMap: Record<string, boolean> = {};
        levelData.tests.forEach(test => {
          testProgressMap[test.id] = isTestCompleted(test.id, progress);
        });
        setTestProgress(testProgressMap);
        
        // Initialize artifact download status
        const artifactDownloadMap: Record<string, boolean> = {};
        levelData.artifacts.forEach(artifact => {
          artifactDownloadMap[artifact.id] = isArtifactDownloaded(artifact.id, progress);
        });
        setArtifactDownloaded(artifactDownloadMap);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching level data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch level data'));
      setLoading(false);
    }
  }, [levelId, user]);

  /**
   * Mark a video as watched
   */
  const markVideoWatched = useCallback((videoId: string) => {
    if (!videoId || !level) return;
    
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        watched: true,
        position: level.videos.find(v => v.id === videoId)?.duration || 0,
        completedAt: new Date().toISOString()
      }
    }));
    
    // In a real app, we would update this in Firestore
    console.log(`Video ${videoId} marked as watched`);
  }, [level]);

  /**
   * Update video position
   */
  const updateVideoPosition = useCallback((videoId: string, position: number) => {
    if (!videoId || !level) return;
    
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        position
      }
    }));
    
    // In a real app, we would debounce this and update in Firestore
    console.log(`Video ${videoId} position updated to ${position}`);
  }, [level]);

  /**
   * Mark a test as completed
   */
  const markTestCompleted = useCallback((testId: string, score: number) => {
    if (!testId || !level) return;
    
    setTestProgress(prev => ({
      ...prev,
      [testId]: true
    }));
    
    // In a real app, we would update this in Firestore with score
    console.log(`Test ${testId} marked as completed with score ${score}`);
  }, [level]);

  /**
   * Mark an artifact as downloaded
   */
  const markArtifactDownloaded = useCallback((artifactId: string) => {
    if (!artifactId || !level) return;
    
    setArtifactDownloaded(prev => ({
      ...prev,
      [artifactId]: true
    }));
    
    // In a real app, we would update this in Firestore
    console.log(`Artifact ${artifactId} marked as downloaded`);
  }, [level]);

  /**
   * Mark level as completed
   */
  const completeLevel = useCallback(() => {
    if (!level || !user) return;
    
    // Check if all videos are watched
    const allVideosWatched = level.videos.every(video => 
      videoProgress[video.id]?.watched
    );
    
    // Check if all tests are completed
    const allTestsCompleted = level.tests.every(test => 
      testProgress[test.id]
    );
    
    // Check if all artifacts are downloaded
    const allArtifactsDownloaded = level.artifacts.every(artifact => 
      artifactDownloaded[artifact.id]
    );
    
    if (!allVideosWatched || !allTestsCompleted || !allArtifactsDownloaded) {
      console.warn('Cannot complete level: not all requirements met');
      return false;
    }
    
    setLevelStatus(LevelStatus.COMPLETED);
    
    // In a real app, we would update this in Firestore
    console.log(`Level ${level.id} marked as completed`);
    return true;
  }, [level, user, videoProgress, testProgress, artifactDownloaded]);

  /**
   * Check if level can be completed
   */
  const canCompleteLevel = useCallback(() => {
    if (!level) return false;
    
    // Check if already completed
    if (levelStatus === LevelStatus.COMPLETED) return false;
    
    // Check if all videos are watched
    const allVideosWatched = level.videos.every(video => 
      videoProgress[video.id]?.watched
    );
    
    // Check if all tests are completed
    const allTestsCompleted = level.tests.every(test => 
      testProgress[test.id]
    );
    
    // Check if all artifacts are downloaded
    const allArtifactsDownloaded = level.artifacts.every(artifact => 
      artifactDownloaded[artifact.id]
    );
    
    return allVideosWatched && allTestsCompleted && allArtifactsDownloaded;
  }, [level, levelStatus, videoProgress, testProgress, artifactDownloaded]);

  return {
    level,
    levelStatus,
    videoProgress,
    testProgress,
    artifactDownloaded,
    loading,
    error,
    markVideoWatched,
    updateVideoPosition,
    markTestCompleted,
    markArtifactDownloaded,
    completeLevel,
    canCompleteLevel
  };
}
```

2. Create `/components/features/level/VideoPlayer.tsx`:

```typescript
/**
 * @file VideoPlayer.tsx
 * @description YouTube video player component for level content
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Check } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  youtubeId: string;
  isWatched: boolean;
  onWatched: () => void;
  onPositionChange: (position: number) => void;
}

/**
 * VideoPlayer component
 * 
 * Displays a YouTube video with progress tracking
 */
export function VideoPlayer({ 
  title, 
  youtubeId, 
  isWatched, 
  onWatched, 
  onPositionChange 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
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
          if (duration > 0 && newPosition >= duration * 0.9 && !isWatched) {
            clearInterval(interval);
            onWatched();
          }
          
          return newPosition;
        });
      }, 1000);
      
      // Store interval ID for cleanup
      return () => clearInterval(interval);
    }
  };
  
  // Generate YouTube embed URL
  const youtubeUrl = `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`;
  
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="aspect-video w-full bg-black relative">
          <iframe
            ref={playerRef}
            src={youtubeUrl}
            className="w-full h-full"
            allowFullScreen
            title={title}
          />
          
          {isWatched && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg">{title}</h3>
          
          <div className="flex items-center mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={togglePlayback}
              className="mr-2"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            {!isWatched && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onWatched}
              >
                Mark as Watched
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

3. Create `/components/features/level/TestComponent.tsx`:

```typescript
/**
 * @file TestComponent.tsx
 * @description Component for displaying and taking tests
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Test, Question } from '@/types';

interface TestComponentProps {
  test: Test;
  isCompleted: boolean;
  onCompleted: (score: number) => void;
}

/**
 * TestComponent
 * 
 * Displays a test with questions and handles scoring
 */
export function TestComponent({ test, isCompleted, onCompleted }: TestComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(test.questions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Get current question
  const question = test.questions[currentQuestion];
  
  // Handle option selection
  const selectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Submit the test
  const submitTest = () => {
    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / test.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    onCompleted(finalScore);
  };
  
  // If test is already completed, show summary
  if (isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Test Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-full">
              <Check className="w-8 h-8" />
            </div>
          </div>
          <p className="text-center">You've already completed this test.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If test is submitted, show results
  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold">{score}%</div>
            <p className="text-gray-500">
              ({test.questions.filter((q, i) => 
                selectedAnswers[i] === q.correctAnswer
              ).length} of {test.questions.length} correct)
            </p>
          </div>
          
          <div className="space-y-4">
            {test.questions.map((q, qIndex) => {
              const isCorrect = selectedAnswers[qIndex] === q.correctAnswer;
              
              return (
                <div 
                  key={q.id}
                  className={`p-3 rounded-lg ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  } border`}
                >
                  <div className="flex items-start">
                    <div className={`shrink-0 mr-2 ${
                      isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm">
                        Your answer: {selectedAnswers[qIndex] >= 0 ? 
                          q.options[selectedAnswers[qIndex]] : 'None'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1 text-green-700">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display current question
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Test Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-teal-500 h-1.5 rounded-full" 
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{question.text}</h3>
          
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === optionIndex
                    ? 'bg-teal-50 border-teal-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => selectOption(optionIndex)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div>
          {currentQuestion === test.questions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={selectedAnswers.some(a => a === -1)}
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
```

4. Create `/components/features/level/ArtifactDownload.tsx`:

```typescript
/**
 * @file ArtifactDownload.tsx
 * @description Component for downloading artifacts
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CheckIcon, FileIcon } from 'lucide-react';
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
        return <FileIcon className="w-5 h-5 text-red-500" />;
      case 'spreadsheet':
        return <FileIcon className="w-5 h-5 text-green-500" />;
      case 'doc':
        return <FileIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {getFileIcon()}
          <span className="ml-2">{artifact.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{artifact.description}</p>
        
        <Button
          onClick={handleDownload}
          variant={isDownloaded ? "outline" : "default"}
          className={`w-full ${isDownloaded ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
        >
          {isDownloaded ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Downloaded
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Artifact
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
```

5. Create `/components/features/level/LevelProgressBar.tsx`:

```typescript
/**
 * @file LevelProgressBar.tsx
 * @description Component for showing progress within a level
 */

import React from 'react';

interface LevelProgressSegment {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface LevelProgressBarProps {
  segments: LevelProgressSegment[];
}

/**
 * LevelProgressBar component
 * 
 * Shows level progress as connected segments
 */
export function LevelProgressBar({ segments }: LevelProgressBarProps) {
  return (
    <div className="w-full flex items-center space-x-1">
      {segments.map((segment, index) => (
        <React.Fragment key={segment.id}>
          {/* Progress segment */}
          <div 
            className={`h-2 flex-1 rounded-full ${
              segment.isCompleted ? 'bg-teal-500' : 'bg-gray-300'
            }`}
            title={segment.title}
          />
          
          {/* Connector between segments (except after the last one) */}
          {index < segments.length - 1 && (
            <div className="w-1 h-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
```

6. Create `/app/(main)/level/[id]/page.tsx`:

```typescript
/**
 * @file page.tsx
 * @description Level detail page with videos, tests, and artifacts
 * @dependencies components/features/level/*
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLevel } from '@/hooks/useLevel';
import { VideoPlayer } from '@/components/features/level/VideoPlayer';
import { TestComponent } from '@/components/features/level/TestComponent';
import { ArtifactDownload } from '@/components/features/level/ArtifactDownload';
import { LevelProgressBar } from '@/components/features/level/LevelProgressBar';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MessageSquareIcon 
} from 'lucide-react';
import { LevelStatus, Test } from '@/types';

export default function LevelPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    level,
    levelStatus,
    videoProgress,
    testProgress,
    artifactDownloaded,
    loading,
    error,
    markVideoWatched,
    updateVideoPosition,
    markTestCompleted,
    markArtifactDownloaded,
    completeLevel,
    canCompleteLevel
  } = useLevel(id);

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
        Error loading level data: {error.message}
      </div>
    );
  }

  // Show placeholder if level not found
  if (!level) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Level Not Found</h1>
        <Link href="/map">
          <Button>Back to Map</Button>
        </Link>
      </div>
    );
  }

  // Check if level is locked
  if (levelStatus === LevelStatus.LOCKED) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Level Locked</h1>
        <p className="mb-6">You need to complete previous levels first.</p>
        <Link href="/map">
          <Button>Back to Map</Button>
        </Link>
      </div>
    );
  }

  // Generate progress segments for the progress bar
  const progressSegments = [
    // Video segments
    ...level.videos.map(video => ({
      id: video.id,
      title: `Video: ${video.title}`,
      isCompleted: videoProgress[video.id]?.watched || false
    })),
    
    // Test segments
    ...level.tests.map(test => ({
      id: test.id,
      title: `Test after ${level.videos.find(v => v.id === test.afterVideoId)?.title || 'video'}`,
      isCompleted: testProgress[test.id] || false
    })),
    
    // Artifact segments
    ...level.artifacts.map(artifact => ({
      id: artifact.id,
      title: `Artifact: ${artifact.title}`,
      isCompleted: artifactDownloaded[artifact.id] || false
    }))
  ];

  // Find test that should appear after a video
  const getTestAfterVideo = (videoId: string): Test | null => {
    return level.tests.find(test => test.afterVideoId === videoId) || null;
  };

  // Handle level completion
  const handleCompleteLevel = () => {
    if (completeLevel()) {
      // In a real app, we would redirect to map or show a completion message
      // For now, we'll just log the completion
      console.log('Level completed!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <Link href="/map" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Вернуться на Карту</span>
        </Link>
      </div>

      {/* Level title */}
      <div>
        <h1 className="text-2xl font-bold">Уровень {level.order}. {level.title}</h1>
        <p className="text-gray-600 mt-1">{level.description}</p>
      </div>

      {/* Level progress bar */}
      <LevelProgressBar segments={progressSegments} />

      {/* Video and test sections */}
      <div className="space-y-8">
        {level.videos.map((video) => (
          <div key={video.id} className="space-y-6">
            {/* Video player */}
            <VideoPlayer
              title={video.title}
              youtubeId={video.youtubeId}
              isWatched={videoProgress[video.id]?.watched || false}
              onWatched={() => markVideoWatched(video.id)}
              onPositionChange={(position) => updateVideoPosition(video.id, position)}
            />
            
            {/* Test after video (if available) */}
            {getTestAfterVideo(video.id) && (
              <TestComponent
                test={getTestAfterVideo(video.id)!}
                isCompleted={testProgress[getTestAfterVideo(video.id)!.id] || false}
                onCompleted={(score) => markTestCompleted(getTestAfterVideo(video.id)!.id, score)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Artifact section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Артефакт</h2>
        <div className="space-y-4">
          {level.artifacts.map((artifact) => (
            <ArtifactDownload
              key={artifact.id}
              artifact={artifact}
              isDownloaded={artifactDownloaded[artifact.id] || false}
              onDownload={() => markArtifactDownloaded(artifact.id)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="outline" 
          className="flex-1 bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
        >
          <MessageSquareIcon className="w-4 h-4 mr-2" />
          Спросить помощника (ИИ бот)
        </Button>
        
        <Button 
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          disabled={!canCompleteLevel() || levelStatus === LevelStatus.COMPLETED}
          onClick={handleCompleteLevel}
        >
          {levelStatus === LevelStatus.COMPLETED 
            ? 'Уровень завершен' 
            : 'Завершить урок'
          }
        </Button>
      </div>
    </div>
  );
}
```

## Expected Output

```
- Level detail feature files:
  - /hooks/useLevel.ts (Hook for individual level data)
  - /components/features/level/VideoPlayer.tsx (Video player component)
  - /components/features/level/TestComponent.tsx (Test taking component)
  - /components/features/level/ArtifactDownload.tsx (Artifact download component)
  - /components/features/level/LevelProgressBar.tsx (Progress visualization)
  - /app/(main)/level/[id]/page.tsx (Level detail page)
```

## Documentation Tasks

1. Update `/status.md` with completed task:
   ```markdown
   # BizLevel Project Status

   ## Last Updated: [CURRENT_DATE]

   ## Current Development Focus
   - Level detail page implementation

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

   ## Current Issues
   - None

   ## Next Up
   - Task 3.1: Implement Artifacts System

   ## Component Status
   - Authentication: Complete (Context, hooks, and pages implemented)
   - Level Map: Complete (Map component with level cards and connections)
   - Profile: Complete (Profile page with progress visualization)
   - Level Detail: Complete (Videos, tests, artifacts, and completion flow)
   - Artifacts: Not Started (Type definitions created)
   - Chat: Not Started (Type definitions created)
   - Settings: Not Started (Type definitions created)
   ```

2. Create `/docs/features/level-detail.md` with a description of the level detail system:
   ```markdown
   # Level Detail System

   ## Overview
   This document describes the level detail system, which is where users access and interact with learning content.

   ## Components

   ### 1. VideoPlayer
   - Displays embedded YouTube videos
   - Tracks watch progress
   - Marks videos as watched automatically at 90% completion
   - Provides manual "Mark as Watched" option

   ### 2. TestComponent
   - Interactive tests with multiple-choice questions
   - Progress tracking through questions
   - Provides feedback and score after completion
   - Shows correct answers for missed questions

   ### 3. ArtifactDownload
   - Downloadable resources related to the level
   - Shows file type and description
   - Tracks download status
   - Different styling for downloaded artifacts

   ### 4. LevelProgressBar
   - Visual progress indicator for level completion
   - Shows status of videos, tests, and artifacts
   - Segments change color based on completion status

   ## Data Management

   ### useLevel Hook
   - Custom hook for accessing individual level data
   - Manages video progress, test completion, and artifact downloads
   - Provides functions for updating progress
   - Tracks overall level completion status
   - Controls level unlocking logic

   ## Level Progression Logic

   ### Requirements for Level Completion
   - Watch all videos
   - Complete all tests
   - Download all artifacts
   - Click "Complete Level" button

   ### Level States
   - Locked: User has not completed prerequisite levels
   - Available: User can access and interact with level content
   - Completed: User has fulfilled all requirements

   ## Content Organization

   ### Content Flow
   1. Videos introduce concepts and skills
   2. Tests appear after relevant videos to check understanding
   3. Artifacts provide practical tools and templates
   4. Completion button becomes available when all requirements are met

   ### Interaction Tracking
   - Video watch progress is tracked and persisted
   - Test completions are recorded with scores
   - Artifact downloads are tracked
   - Overall progress is visualized in the progress bar

   ## Implementation Details
   - React components with TypeScript
   - YouTube embedding for videos
   - Interactive test interface with immediate feedback
   - Mock file downloads (simulated in demo)
   - Progress tracking with local state (will use Firestore in production)
   ```

3. Create a snapshot document at `/docs/snapshots/level-detail.md`:
   ```markdown
   # Level Detail System Snapshot

   ## Purpose
   Display and track progress through level content (videos, tests, artifacts)

   ## Key Files
   - `/hooks/useLevel.ts` - Hook for level data management
   - `/components/features/level/VideoPlayer.tsx` - Video player component
   - `/components/features/level/TestComponent.tsx` - Interactive test component
   - `/components/features/level/ArtifactDownload.tsx` - Artifact download component
   - `/components/features/level/LevelProgressBar.tsx` - Progress visualization
   - `/app/(main)/level/[id]/page.tsx` - Level detail page

   ## State Management
   - Level data from mock data (will be from Firestore in production)
   - Video progress tracked with positions and watch status
   - Test completion tracked with scores
   - Artifact downloads tracked
   - Overall completion status determines when level can be completed

   ## Data Flow
   1. useLevel hook fetches level data and progress
   2. Level detail page organizes content in sequence
   3. User interacts with videos, tests, and artifacts
   4. Component state updates locally (will update Firestore in production)
   5. Level completion is enabled when all requirements are met

   ## Key Decisions
   - Embedding YouTube videos for content delivery
   - Automatic marking of videos as watched at 90% completion
   - Test interface with step-by-step progression through questions
   - Visual progress bar showing overall level completion status

   ## Usage Example
   ```tsx
   import { useLevel } from '@/hooks/useLevel';
   import { VideoPlayer } from '@/components/features/level/VideoPlayer';

   function VideoSection({ videoId }: { videoId: string }) {
     const { videoProgress, markVideoWatched, updateVideoPosition } = useLevel('level-1');
     
     return (
       <VideoPlayer
         title="Introduction to Business Planning"
         youtubeId="dQw4w9WgXcQ"
         isWatched={videoProgress[videoId]?.watched || false}
         onWatched={() => markVideoWatched(videoId)}
         onPositionChange={(position) => updateVideoPosition(videoId, position)}
       />
     );
   }
   ```

   ## Known Issues
   - YouTube embedding is basic in the prototype; needs YouTube API integration for production
   - File downloads are simulated in the prototype
   ```

## Testing Instructions

1. Test the level detail page:
   - Run the development server
   - Navigate to the map page and click on an available level
   - Verify that the level detail page loads with videos, tests, and artifacts
   - Check that the progress bar shows the correct status for each segment

2. Test video player:
   - Play a video and verify that it works
   - Test the "Mark as Watched" button
   - Verify that watched videos show the completion indicator

3. Test quiz component:
   - Answer quiz questions
   - Navigate between questions
   - Submit the quiz and review results
   - Verify that completed quizzes show as completed

4. Test artifact downloads:
   - Click on download buttons
   - Verify that downloaded artifacts show the completed status
   - Check that the download status is tracked properly

5. Test level completion:
   - Complete all videos, tests, and artifacts
   - Verify that the "Complete Level" button becomes enabled
   - Click the button and verify that the level is marked as completed

6. Test edge cases:
   - Try to access a locked level
   - Try to complete a level without completing all requirements
   - Test the page with various level content combinations
