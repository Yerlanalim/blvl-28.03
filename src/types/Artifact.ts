/**
 * @file Artifact.ts
 * @description Type definitions for downloadable artifacts
 */

// Artifact file types
export enum ArtifactFileType {
  PDF = 'pdf',
  DOC = 'doc',
  SPREADSHEET = 'spreadsheet'
}

// Artifact metadata
export interface Artifact {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: ArtifactFileType;
  levelId: string;
  downloadCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User artifact interaction
export interface ArtifactInteraction {
  userId: string;
  artifactId: string;
  downloaded: boolean;
  downloadedAt?: Date | string;
  feedback?: {
    rating: number;
    comment?: string;
  };
} 