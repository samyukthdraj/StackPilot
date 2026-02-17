import { Resume, StructuredResumeData } from '../entities/resume.entity';

export class ResumeResponseDto {
  id: string;
  fileName?: string;
  atsScore?: number;
  scoreBreakdown?: {
    skillMatch: number;
    projectStrength: number;
    experienceRelevance: number;
    resumeStructure: number;
    keywordDensity: number;
    actionVerbs: number;
    total: number;
  };
  structuredData?: StructuredResumeData;
  isPrimary: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(resume: Resume): ResumeResponseDto {
    return {
      id: resume.id,
      fileName: resume.fileName,
      atsScore: resume.atsScore,
      scoreBreakdown: resume.scoreBreakdown,
      structuredData: resume.structuredData,
      isPrimary: resume.isPrimary,
      version: resume.version,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  }
}
