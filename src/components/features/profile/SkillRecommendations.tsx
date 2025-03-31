/**
 * @file SkillRecommendations.tsx
 * @description Component for displaying skill improvement recommendations
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkillInfo } from '@/lib/services/skill-service';
import { Level } from '@/types';
import { TrendingUp } from 'lucide-react';

interface SkillRecommendationsProps {
  recommendations: Array<SkillInfo & { recommendedLevels: Level[] }>;
}

/**
 * SkillRecommendations component
 * 
 * Displays recommended levels for improving weaker skills
 */
export function SkillRecommendations({ recommendations }: SkillRecommendationsProps) {
  // If no recommendations, don't render
  if (!recommendations.length) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Рекомендации по развитию навыков
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((recommendation) => (
          <div key={recommendation.type} className="space-y-3">
            <div>
              <h3 className="font-medium">{recommendation.displayName}</h3>
              <p className="text-sm text-gray-500">
                Текущий прогресс: {recommendation.progress}%
              </p>
            </div>
            
            {recommendation.recommendedLevels.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm">Рекомендуемые уровни:</p>
                <div className="space-y-2">
                  {recommendation.recommendedLevels.map((level) => (
                    <div key={level.id} className="border rounded-lg p-3">
                      <h4 className="font-medium">Уровень {level.order}: {level.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {level.description}
                      </p>
                      <Link href={`/level/${level.id}`}>
                        <Button variant="outline" size="sm">
                          Перейти к уровню
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">
                Все уровни для этого навыка уже пройдены. Отличная работа!
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 