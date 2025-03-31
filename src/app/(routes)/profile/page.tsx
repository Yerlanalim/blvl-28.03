/**
 * @file page.tsx
 * @description User profile page
 * @dependencies components/features/profile/*
 */

'use client';

import { useProfile } from '@/hooks/useProfile';
import { useProgress } from '@/hooks/useProgress';
import { ProfileCard } from '@/components/features/profile/ProfileCard';
import { BadgeDisplay } from '@/components/features/profile/BadgeDisplay';
import { ProgressOverview } from '@/components/features/profile/ProgressOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillProgressSection } from '@/components/features/profile/SkillProgressSection';
import { SkillRecommendations } from '@/components/features/profile/SkillRecommendations';

export default function ProfilePage() {
  const {
    user,
    loading: profileLoading,
    error: profileError,
    getFormattedSkills,
    getOverallProgress,
    completedLevelsCount,
    badges
  } = useProfile();

  const {
    progress,
    isLoading: progressLoading,
    error: progressError,
    getFormattedSkillProgress,
    getSkillRecommendationsForUser
  } = useProgress();

  const loading = profileLoading || progressLoading;
  const error = profileError || progressError;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-lg">
        Error loading profile data: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Профиль</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const overallProgress = getOverallProgress();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="font-medium">Профиль</span>
        </div>
      </div>

      {/* Profile information */}
      <ProfileCard user={user} businessInfo={user.businessInfo} />

      {/* Skills */}
      <SkillProgressSection
        skills={getFormattedSkillProgress()}
      />

      {/* Skill Recommendations */}
      <SkillRecommendations
        recommendations={getSkillRecommendationsForUser()}
      />

      {/* Progress */}
      <ProgressOverview
        completedLevels={completedLevelsCount}
        totalLevels={10}
        overallProgress={overallProgress}
      />

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Личные и контактные данные:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Имя:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 