/**
 * @file page.tsx
 * @description Level detail page component
 * @dependencies useLevel, components/features/level/*
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useLevel } from '@/hooks/useLevel';
import { LevelStatus } from '@/types';
import React from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
// import { Progress } from '@/components/ui/progress'; // Не используется в коде

// Level Feature Components
import { VideoPlayer } from '@/components/features/level/VideoPlayer';
import { TestModule } from '@/components/features/level/TestModule';
import { ArtifactDownload } from '@/components/features/level/ArtifactDownload';
import { LockedLevel } from '@/components/features/level/LockedLevel';
import { LoadingState } from '@/components/shared/LoadingState';

export default function LevelPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // Используем React.use для развертывания Promise параметров
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  
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

  // Total progress calculation
  const progressPercentage = useMemo(() => {
    if (!level) return 0;
    
    const totalItems = level.videos.length + level.tests.length + level.artifacts.length;
    if (totalItems === 0) return 100; // No items means completed
    
    let completedItems = 0;
    
    // Count completed videos
    completedItems += level.videos.filter(v => videoProgress[v.id]?.watched).length;
    
    // Count completed tests
    completedItems += level.tests.filter(t => testProgress[t.id]).length;
    
    // Count downloaded artifacts
    completedItems += level.artifacts.filter(a => artifactDownloaded[a.id]).length;
    
    return Math.round((completedItems / totalItems) * 100);
  }, [level, videoProgress, testProgress, artifactDownloaded]);

  // Progress segments for more visual detail
  const progressSegments = useMemo(() => {
    if (!level) return { videos: 0, tests: 0, artifacts: 0 };
    
    const totalWeight = 100;
    const videoWeight = level.videos.length ? (totalWeight * 0.4) : 0;
    const testWeight = level.tests.length ? (totalWeight * 0.4) : 0;
    const artifactWeight = level.artifacts.length ? (totalWeight * 0.2) : 0;
    
    // Adjust weights if some sections are missing
    const totalAssignedWeight = videoWeight + testWeight + artifactWeight;
    const weightMultiplier = totalAssignedWeight ? (totalWeight / totalAssignedWeight) : 1;
    
    // Calculate progress for each segment
    const videosProgress = level.videos.length 
      ? (level.videos.filter(v => videoProgress[v.id]?.watched).length / level.videos.length) * videoWeight * weightMultiplier
      : 0;
      
    const testsProgress = level.tests.length 
      ? (level.tests.filter(t => testProgress[t.id]).length / level.tests.length) * testWeight * weightMultiplier
      : 0;
      
    const artifactsProgress = level.artifacts.length 
      ? (level.artifacts.filter(a => artifactDownloaded[a.id]).length / level.artifacts.length) * artifactWeight * weightMultiplier
      : 0;
    
    return {
      videos: Math.round(videosProgress),
      tests: Math.round(testsProgress),
      artifacts: Math.round(artifactsProgress)
    };
  }, [level, videoProgress, testProgress, artifactDownloaded]);

  // Handle level completion
  const handleCompleteLevel = useCallback(() => {
    if (completeLevel()) {
      // Show success message or modal
      alert('Уровень успешно завершен!');
      
      // Navigate to next level or dashboard
      router.push('/dashboard');
    }
  }, [completeLevel, router]);

  // Handle navigation back
  const handleBackClick = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // Handle ask for help
  const handleAskForHelp = useCallback(() => {
    router.push(`/chat?levelId=${id}`);
  }, [router, id]);

  // Loading state
  if (loading) {
    return <LoadingState message="Загрузка уровня..." />;
  }

  // Error state
  if (error || !level) {
    return notFound();
  }

  // Locked level state
  if (levelStatus === LevelStatus.LOCKED) {
    return <LockedLevel level={level} onBackClick={handleBackClick} />;
  }

  // Completed or available level content
  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={handleBackClick}
        >
          <ArrowLeft size={16} />
          Назад
        </Button>
        
        {levelStatus === LevelStatus.COMPLETED && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span>Уровень пройден</span>
          </div>
        )}
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">{level.title}</h1>
        <p className="text-muted-foreground mt-2">{level.description}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогресс уровня</span>
          <span>{progressPercentage}%</span>
        </div>
        
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          {progressSegments.videos > 0 && (
            <div 
              className="h-full bg-blue-500 float-left" 
              style={{ width: `${progressSegments.videos}%` }}
              title="Видео"
            />
          )}
          {progressSegments.tests > 0 && (
            <div 
              className="h-full bg-purple-500 float-left" 
              style={{ width: `${progressSegments.tests}%` }}
              title="Тесты"
            />
          )}
          {progressSegments.artifacts > 0 && (
            <div 
              className="h-full bg-amber-500 float-left" 
              style={{ width: `${progressSegments.artifacts}%` }}
              title="Материалы"
            />
          )}
        </div>
        
        <div className="flex gap-4 text-xs text-muted-foreground">
          {level.videos.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Видео</span>
            </div>
          )}
          {level.tests.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span>Тесты</span>
            </div>
          )}
          {level.artifacts.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span>Материалы</span>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Videos Section */}
      {level.videos.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Видеоматериалы</h2>
          
          <div className="space-y-6">
            {level.videos.map((video) => (
              <VideoPlayer
                key={video.id}
                video={video}
                progress={videoProgress[video.id]}
                onVideoComplete={() => markVideoWatched(video.id)}
                onPositionChange={(position) => updateVideoPosition(video.id, position)}
              />
            ))}
          </div>
          
          <Separator />
        </div>
      )}
      
      {/* Tests Section */}
      {level.tests.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Тесты</h2>
          
          <div className="space-y-6">
            {level.tests.map((test) => (
              <TestModule
                key={test.id}
                test={test}
                isCompleted={testProgress[test.id]}
                onTestComplete={(score) => markTestCompleted(test.id, score)}
              />
            ))}
          </div>
          
          <Separator />
        </div>
      )}
      
      {/* Artifacts Section */}
      {level.artifacts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Материалы</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {level.artifacts.map((artifact) => (
              <ArtifactDownload
                key={artifact.id}
                artifact={artifact}
                isDownloaded={artifactDownloaded[artifact.id]}
                onDownload={() => markArtifactDownloaded(artifact.id)}
              />
            ))}
          </div>
          
          <Separator />
        </div>
      )}
      
      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
        <Button 
          variant="outline"
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={handleAskForHelp}
        >
          <HelpCircle size={16} />
          Задать вопрос
        </Button>
        
        <Button
          className="w-full sm:w-auto"
          disabled={!canCompleteLevel()}
          onClick={handleCompleteLevel}
        >
          {levelStatus === LevelStatus.COMPLETED 
            ? 'Уровень пройден' 
            : canCompleteLevel() 
              ? 'Завершить уровень' 
              : 'Выполните все задания'
          }
        </Button>
      </div>
    </div>
  );
} 