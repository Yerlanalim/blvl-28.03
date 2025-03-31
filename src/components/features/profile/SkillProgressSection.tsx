/**
 * @file SkillProgressSection.tsx
 * @description Enhanced component for displaying skill progress
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillInfo } from '@/lib/services/skill-service';

interface SkillProgressSectionProps {
  skills: Array<SkillInfo & { progress: number }>;
}

/**
 * SkillProgressSection component
 * 
 * Displays skill progress with informative details
 */
export function SkillProgressSection({ skills }: SkillProgressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Навыки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.type} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{skill.displayName}</h3>
                <p className="text-sm text-gray-500">{skill.description}</p>
              </div>
              <span className="text-sm font-medium">{skill.progress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-3 rounded-full" 
                style={{ 
                  width: `${skill.progress}%`,
                  backgroundColor: skill.color || '#10B981'
                }}
              ></div>
            </div>
            
            {/* Progress dots (alternative visualization) */}
            <div className="flex space-x-1 pt-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-full ${
                    index < Math.ceil(skill.progress / 10) 
                      ? 'bg-teal-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 