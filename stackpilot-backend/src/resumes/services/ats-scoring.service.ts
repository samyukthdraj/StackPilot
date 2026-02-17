import { Injectable, Logger } from '@nestjs/common';
import { StructuredResumeData } from '../entities/resume.entity';

export interface ATSScoreBreakdown {
  skillMatch: number;
  projectStrength: number;
  experienceRelevance: number;
  resumeStructure: number;
  keywordDensity: number;
  actionVerbs: number;
  total: number;
}

@Injectable()
export class ATSScoringService {
  private readonly logger = new Logger(ATSScoringService.name);

  // Weights for different scoring categories
  private readonly weights = {
    skillMatch: 0.4, // 40%
    projectStrength: 0.2, // 20%
    experienceRelevance: 0.15, // 15%
    resumeStructure: 0.1, // 10%
    keywordDensity: 0.1, // 10%
    actionVerbs: 0.05, // 5%
  };

  // Common skills dictionary for tech roles
  private readonly skillDictionary = new Set<string>([
    'javascript',
    'typescript',
    'python',
    'java',
    'c#',
    'c++',
    'ruby',
    'php',
    'go',
    'rust',
    'swift',
    'kotlin',
    'react',
    'angular',
    'vue',
    'node.js',
    'express',
    'django',
    'flask',
    'spring',
    'asp.net',
    'html',
    'css',
    'sass',
    'less',
    'tailwind',
    'bootstrap',
    'material-ui',
    'redux',
    'mobx',
    'graphql',
    'rest',
    'api',
    'database',
    'sql',
    'postgresql',
    'mysql',
    'mongodb',
    'firebase',
    'supabase',
    'aws',
    'azure',
    'gcp',
    'docker',
    'kubernetes',
    'jenkins',
    'git',
    'github',
    'gitlab',
    'bitbucket',
    'jira',
    'confluence',
    'vscode',
  ]);

  // Industry keywords for relevance scoring
  private readonly industryKeywords = new Set<string>([
    'agile',
    'scrum',
    'git',
    'version control',
    'ci/cd',
    'testing',
    'debugging',
    'optimization',
    'performance',
    'scalability',
    'security',
    'authentication',
    'api',
    'rest',
    'graphql',
    'database',
    'cloud',
    'aws',
    'azure',
    'docker',
    'kubernetes',
    'microservices',
    'architecture',
    'design patterns',
    'algorithms',
    'data structures',
  ]);

  calculateScore(resumeData: StructuredResumeData): ATSScoreBreakdown {
    try {
      const skillMatch = this.calculateSkillMatchScore(resumeData.skills);
      const projectStrength = this.calculateProjectStrengthScore(
        resumeData.projects,
      );
      const experienceRelevance = this.calculateExperienceRelevanceScore(
        resumeData.experience,
      );
      const resumeStructure = this.calculateResumeStructureScore(resumeData);
      const keywordDensity = this.calculateKeywordDensityScore(resumeData);
      const actionVerbs = this.calculateActionVerbScore(resumeData);

      const total = Math.round(
        skillMatch * this.weights.skillMatch +
          projectStrength * this.weights.projectStrength +
          experienceRelevance * this.weights.experienceRelevance +
          resumeStructure * this.weights.resumeStructure +
          keywordDensity * this.weights.keywordDensity +
          actionVerbs * this.weights.actionVerbs,
      );

      return {
        skillMatch: Math.round(skillMatch),
        projectStrength: Math.round(projectStrength),
        experienceRelevance: Math.round(experienceRelevance),
        resumeStructure: Math.round(resumeStructure),
        keywordDensity: Math.round(keywordDensity),
        actionVerbs: Math.round(actionVerbs),
        total: Math.min(100, Math.max(0, total)), // Clamp between 0-100
      };
    } catch (error) {
      this.logger.error('Error calculating ATS score:', error);
      return {
        skillMatch: 0,
        projectStrength: 0,
        experienceRelevance: 0,
        resumeStructure: 0,
        keywordDensity: 0,
        actionVerbs: 0,
        total: 0,
      };
    }
  }

  private calculateSkillMatchScore(skills: string[]): number {
    if (!skills || skills.length === 0) return 0;

    // Score based on number of skills and their relevance
    // More skills = higher score, but diminishing returns after 20
    const baseScore = Math.min(skills.length * 5, 70);

    // Check for highly sought-after skills bonus
    const highDemandSkills = [
      'react',
      'node.js',
      'python',
      'typescript',
      'aws',
      'docker',
    ];
    const hasHighDemand = highDemandSkills.some((skill) =>
      skills.some((s) => s.toLowerCase().includes(skill)),
    );

    const bonus = hasHighDemand ? 30 : 0;

    return Math.min(100, baseScore + bonus);
  }

  private calculateProjectStrengthScore(
    projects: StructuredResumeData['projects'],
  ): number {
    if (!projects || projects.length === 0) return 0;

    let totalScore = 0;

    for (const project of projects) {
      let projectScore = 0;

      // Description length and detail
      const descriptionLength = project.description?.length || 0;
      projectScore += Math.min(descriptionLength / 20, 30); // Max 30 points for detailed description

      // Technologies used
      const techCount = project.technologies?.length || 0;
      projectScore += Math.min(techCount * 5, 30); // Max 30 points for diverse tech stack

      // Has URL/link
      if (project.url) {
        projectScore += 20;
      }

      // Quality indicators (action verbs, specific metrics)
      if (project.description) {
        if (/\d+%/.test(project.description)) projectScore += 10; // Has percentages
        if (/\d+ users|\d+ customers/i.test(project.description))
          projectScore += 10; // Has user metrics
        if (/reduced|increased|improved|optimized/i.test(project.description))
          projectScore += 10; // Has impact words
      }

      totalScore += Math.min(projectScore, 100);
    }

    // Average project score with bonus for multiple projects
    const averageScore = totalScore / projects.length;
    const projectCountBonus = Math.min(projects.length * 5, 20);

    return Math.min(100, averageScore + projectCountBonus);
  }

  private calculateExperienceRelevanceScore(
    experience: StructuredResumeData['experience'],
  ): number {
    if (!experience || experience.length === 0) return 0;

    let totalScore = 0;

    for (const exp of experience) {
      let expScore = 0;

      // Check for relevant job titles
      if (exp.title) {
        const titleLower = exp.title.toLowerCase();
        if (
          titleLower.includes('developer') ||
          titleLower.includes('engineer')
        ) {
          expScore += 30;
        }
        if (titleLower.includes('senior') || titleLower.includes('lead')) {
          expScore += 20;
        }
        if (
          titleLower.includes('full stack') ||
          titleLower.includes('fullstack')
        ) {
          expScore += 20;
        }
      }

      // Description quality and relevance
      const descriptionText = exp.description.join(' ').toLowerCase();

      // Check for industry keywords
      const keywordMatches = Array.from(this.industryKeywords).filter(
        (keyword) => descriptionText.includes(keyword.toLowerCase()),
      ).length;

      expScore += Math.min(keywordMatches * 5, 30);

      // Check for metrics and achievements
      if (/\d+%/.test(descriptionText)) expScore += 10;
      if (/led|managed|responsible for/i.test(descriptionText)) expScore += 10;
      if (/team|collaborated|cross-functional/i.test(descriptionText))
        expScore += 10;

      totalScore += Math.min(expScore, 100);
    }

    // Average experience score
    return totalScore / experience.length;
  }

  private calculateResumeStructureScore(
    resumeData: StructuredResumeData,
  ): number {
    let score = 0;

    // Check for presence of key sections
    if (resumeData.summary) score += 15;
    if (resumeData.skills && resumeData.skills.length > 0) score += 20;
    if (resumeData.experience && resumeData.experience.length > 0) score += 25;
    if (resumeData.projects && resumeData.projects.length > 0) score += 20;
    if (resumeData.education && resumeData.education.length > 0) score += 20;

    // Personal info bonus
    if (resumeData.personalInfo) {
      if (resumeData.personalInfo.email) score += 5;
      if (resumeData.personalInfo.phone) score += 5;
      if (resumeData.personalInfo.linkedin) score += 5;
      if (resumeData.personalInfo.github) score += 5;
    }

    return Math.min(100, score);
  }

  private calculateKeywordDensityScore(
    resumeData: StructuredResumeData,
  ): number {
    // Combine all text for analysis
    const allText = [
      resumeData.summary || '',
      ...(resumeData.skills || []),
      ...(resumeData.experience?.flatMap((e) => e.description) || []),
      ...(resumeData.projects?.flatMap((p) => [p.name, p.description]) || []),
    ]
      .join(' ')
      .toLowerCase();

    const words = allText.split(/\s+/).filter((w) => w.length > 2);
    if (words.length === 0) return 0;

    // Count technical keywords
    const techKeywordCount = words.filter((word) =>
      this.skillDictionary.has(word),
    ).length;
    const industryKeywordCount = Array.from(this.industryKeywords).filter(
      (keyword) => allText.includes(keyword.toLowerCase()),
    ).length;

    // Calculate density (target: 20-30% keywords)
    const keywordDensity =
      ((techKeywordCount + industryKeywordCount * 2) / words.length) * 100;

    // Optimal density is around 25%
    if (keywordDensity < 10) return 30;
    if (keywordDensity < 20) return 60;
    if (keywordDensity <= 30) return 100;
    if (keywordDensity <= 40) return 80;
    return 60; // Too many keywords (keyword stuffing)
  }

  private calculateActionVerbScore(resumeData: StructuredResumeData): number {
    const actionVerbs = new Set<string>([
      'developed',
      'built',
      'created',
      'designed',
      'implemented',
      'engineered',
      'architected',
      'delivered',
      'launched',
      'deployed',
      'managed',
      'led',
      'coordinated',
      'collaborated',
      'improved',
      'optimized',
      'enhanced',
      'refactored',
      'debugged',
      'tested',
      'validated',
      'analyzed',
      'researched',
      'documented',
      'mentored',
      'trained',
      'presented',
      'communicated',
      'negotiated',
      'achieved',
      'exceeded',
      'reduced',
      'increased',
      'accelerated',
      'streamlined',
      'automated',
      'spearheaded',
      'pioneered',
      'championed',
      'orchestrated',
    ]);

    // Collect all bullet points
    const bulletPoints = [
      ...(resumeData.experience?.flatMap((e) => e.description) || []),
      ...(resumeData.projects?.flatMap((p) => [p.description]) || []),
    ];

    if (bulletPoints.length === 0) return 0;

    let totalActionVerbs = 0;
    let totalBullets = 0;

    for (const bullet of bulletPoints) {
      const words = bullet.toLowerCase().split(/\s+/);
      if (words.length > 0) {
        const firstWord = words[0];
        if (firstWord && actionVerbs.has(firstWord)) {
          totalActionVerbs++;
        }
      }
      totalBullets++;
    }

    // Score based on percentage of bullets starting with action verbs
    const actionVerbPercentage =
      totalBullets > 0 ? (totalActionVerbs / totalBullets) * 100 : 0;

    if (actionVerbPercentage >= 80) return 100;
    if (actionVerbPercentage >= 60) return 80;
    if (actionVerbPercentage >= 40) return 60;
    if (actionVerbPercentage >= 20) return 40;
    return 20;
  }
}
