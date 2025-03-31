/**
 * @file ProgressDebugPanel.tsx
 * @description Debug panel for testing progress tracking system
 * @dependencies hooks/useProgress, hooks/useLevels
 */

'use client';

import React from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useLevels } from '@/hooks/useLevels';
import { SkillType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillProgressSection } from '@/components/features/profile/SkillProgressSection';

/**
 * ProgressDebugPanel component
 * 
 * Allows testing of progress tracking functionality
 */
export function ProgressDebugPanel() {
  const { 
    progress, 
    isLoading, 
    isUpdating,
    resetProgress, 
    getSkillProgress,
    getEarnedBadges,
    getFormattedSkillProgress
  } = useProgress();
  
  const { levels, getLevelsWithStatus } = useLevels();
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center">Loading progress data...</p>
      </div>
    );
  }
  
  // If no progress, show message
  if (!progress) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center">No progress data available. Please log in.</p>
      </div>
    );
  }
  
  // Get levels with status
  const levelsWithStatus = getLevelsWithStatus();
  
  // Get skill progress
  const skills = Object.values(SkillType).map(skill => ({
    type: skill,
    progress: getSkillProgress(skill)
  }));
  
  // Get earned badges
  const badges = getEarnedBadges();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Progress Debug Panel</span>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={resetProgress}
              disabled={isUpdating}
            >
              Reset Progress
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current progress overview */}
          <div>
            <h3 className="text-lg font-medium mb-2">Current Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Current Level:</p>
                <p className="text-sm">{progress.currentLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed Levels:</p>
                <p className="text-sm">{progress.completedLevels.length} of {levels.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Watched Videos:</p>
                <p className="text-sm">{progress.watchedVideos.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed Tests:</p>
                <p className="text-sm">{progress.completedTests.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Downloaded Artifacts:</p>
                <p className="text-sm">{progress.downloadedArtifacts.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Earned Badges:</p>
                <p className="text-sm">{badges.length}</p>
              </div>
            </div>
          </div>
          
          {/* Skill progress */}
          <div>
            <h3 className="text-lg font-medium mb-2">Skill Progress</h3>
            <SkillProgressSection skills={getFormattedSkillProgress()} />
          </div>
          
          {/* Level status */}
          <div>
            <h3 className="text-lg font-medium mb-2">Level Status</h3>
            <div className="grid grid-cols-5 gap-2">
              {levelsWithStatus.map(level => (
                <div 
                  key={level.id} 
                  className={`p-2 rounded text-center text-sm ${
                    level.status === 'completed' ? 'bg-green-100 text-green-800' :
                    level.status === 'available' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  Level {level.order}
                  <span className="block text-xs capitalize">{level.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Badges */}
          {badges.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Earned Badges</h3>
              <div className="grid grid-cols-3 gap-2">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className="p-2 bg-amber-100 text-amber-800 rounded"
                  >
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 