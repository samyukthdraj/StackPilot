import { Injectable, Logger } from '@nestjs/common';
import { StructuredResumeData } from '../entities/resume.entity';

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);

  // Common skills dictionary for tech roles
  private readonly skillDictionary = new Set([
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
    'webpack',
    'babel',
    'eslint',
    'jest',
    'mocha',
    'chai',
    'cypress',
    'selenium',
    'storybook',
    'figma',
    'sketch',
    'adobe xd',
    'photoshop',
    'illustrator',
    'agile',
    'scrum',
    'kanban',
    'tdd',
    'ci/cd',
    'devops',
    'frontend',
    'backend',
    'fullstack',
    'responsive design',
    'cross-browser',
    'performance',
    'accessibility',
    'seo',
    'security',
    'authentication',
    'authorization',
    'jwt',
    'oauth',
    'websockets',
    'microservices',
    'serverless',
    'lambda',
    'vercel',
    'netlify',
    'heroku',
    'render',
  ]);

  // Action verbs for strong resume bullet points
  private readonly actionVerbs = new Set([
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
  ]);

  parseResume(rawText: string): StructuredResumeData {
    try {
      const lines = rawText.split('\n').filter((line) => line.trim());

      const structured: StructuredResumeData = {
        skills: [],
        experience: [],
        projects: [],
        education: [],
      };

      // Extract sections
      let currentSection: string | null = null;
      const sections: Record<string, string[]> = {};

      for (const line of lines) {
        const trimmedLine = line.trim();
        const sectionMatch = this.detectSection(trimmedLine);

        if (sectionMatch) {
          currentSection = sectionMatch;
          sections[currentSection] = [];
        } else if (currentSection) {
          sections[currentSection].push(trimmedLine);
        }
      }

      // Parse each section
      if (sections.summary || sections.profile) {
        const summaryLines = sections.summary || sections.profile || [];
        structured.summary = summaryLines.join(' ').trim();
      }

      if (sections.skills || sections.technologies) {
        const skillLines = sections.skills || sections.technologies || [];
        structured.skills = this.extractSkills(skillLines.join(' '));
      }

      if (sections.experience || sections.work) {
        const expLines = sections.experience || sections.work || [];
        structured.experience = this.extractExperience(expLines);
      }

      if (sections.projects) {
        structured.projects = this.extractProjects(sections.projects);
      }

      if (sections.education) {
        structured.education = this.extractEducation(sections.education);
      }

      // Try to extract personal info from the top of resume
      structured.personalInfo = this.extractPersonalInfo(
        lines.slice(0, 10).join('\n'),
      );

      return structured;
    } catch (error) {
      this.logger.error('Error parsing resume:', error);
      return {
        skills: [],
        experience: [],
        projects: [],
        education: [],
      };
    }
  }

  private detectSection(line: string): string | null {
    const sectionPatterns = [
      { pattern: /^(summary|profile|about)/i, name: 'summary' },
      { pattern: /^(skills|technologies|tech stack)/i, name: 'skills' },
      {
        pattern: /^(experience|work experience|employment)/i,
        name: 'experience',
      },
      { pattern: /^(projects|personal projects)/i, name: 'projects' },
      { pattern: /^(education|academic|qualifications)/i, name: 'education' },
      { pattern: /^(certifications|certificates)/i, name: 'certifications' },
      { pattern: /^(languages)/i, name: 'languages' },
    ];

    for (const { pattern, name } of sectionPatterns) {
      if (pattern.test(line)) {
        return name;
      }
    }

    return null;
  }

  private extractSkills(text: string): string[] {
    const words = text.toLowerCase().split(/[\s,|•]+/);
    const skills = new Set<string>();

    for (const word of words) {
      const cleanWord = word.replace(/[^\w.#+]/g, '');
      if (cleanWord && this.skillDictionary.has(cleanWord)) {
        skills.add(cleanWord);
      }
    }

    // Also check for multi-word skills
    for (const skill of this.skillDictionary) {
      if (skill.includes(' ') && text.toLowerCase().includes(skill)) {
        skills.add(skill);
      }
    }

    return Array.from(skills).sort();
  }

  private extractExperience(
    lines: string[],
  ): StructuredResumeData['experience'] {
    const experiences: StructuredResumeData['experience'] = [];
    let currentExp: Partial<StructuredResumeData['experience'][0]> | null =
      null;

    for (const line of lines) {
      // Check for company/position line (usually bold/important)
      if (this.isCompanyLine(line)) {
        if (currentExp?.company) {
          experiences.push(currentExp as StructuredResumeData['experience'][0]);
        }

        const parts = line.split('|').map((p) => p.trim());
        currentExp = {
          company: parts[0],
          title: parts[1] || '',
          description: [],
          technologies: [],
        };

        // Try to extract dates
        const dateMatch = line.match(
          /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i,
        );
        if (dateMatch) {
          currentExp.startDate = dateMatch[0];
        }
      } else if (currentExp && line.trim()) {
        // Add to description and extract technologies
        const technologies = this.extractSkills(line);
        currentExp.technologies = [
          ...new Set([...(currentExp.technologies || []), ...technologies]),
        ];

        // Fix: Check if description exists before pushing
        if (currentExp.description) {
          currentExp.description.push(line.trim());
        } else {
          currentExp.description = [line.trim()];
        }
      }
    }

    if (currentExp?.company) {
      experiences.push(currentExp as StructuredResumeData['experience'][0]);
    }

    return experiences;
  }

  private extractProjects(lines: string[]): StructuredResumeData['projects'] {
    const projects: StructuredResumeData['projects'] = [];
    let currentProject: Partial<StructuredResumeData['projects'][0]> | null =
      null;

    for (const line of lines) {
      if (this.isProjectName(line)) {
        if (currentProject?.name) {
          projects.push(currentProject as StructuredResumeData['projects'][0]);
        }

        currentProject = {
          name: line.trim(),
          description: '',
          technologies: [],
        };
      } else if (currentProject) {
        currentProject.description +=
          (currentProject.description ? ' ' : '') + line.trim();
        const technologies = this.extractSkills(line);
        currentProject.technologies = [
          ...new Set([...(currentProject.technologies || []), ...technologies]),
        ];
      }
    }

    if (currentProject?.name) {
      projects.push(currentProject as StructuredResumeData['projects'][0]);
    }

    return projects;
  }

  private extractEducation(lines: string[]): StructuredResumeData['education'] {
    const education: StructuredResumeData['education'] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.match(
          /(university|college|institute|b\.?s\.?|m\.?s\.?|bachelor|master|ph\.?d)/i,
        )
      ) {
        const edu: StructuredResumeData['education'][0] = {
          institution: line.trim(),
          degree: '',
        };

        // Look ahead for degree info
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (nextLine.match(/(b\.?s\.?|bachelor|m\.?s\.?|master|ph\.?d)/i)) {
            edu.degree = nextLine.trim();
            i++;
          }
        }

        education.push(edu);
      }
    }

    return education;
  }

  private extractPersonalInfo(
    text: string,
  ): StructuredResumeData['personalInfo'] {
    const info: StructuredResumeData['personalInfo'] = {};

    // Extract email
    const emailMatch = text.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    );
    if (emailMatch) {
      info.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = text.match(
      /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/,
    );
    if (phoneMatch) {
      info.phone = phoneMatch[0];
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[A-Za-z0-9-]+/i);
    if (linkedinMatch) {
      info.linkedin = linkedinMatch[0];
    }

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/[A-Za-z0-9-]+/i);
    if (githubMatch) {
      info.github = githubMatch[0];
    }

    return Object.keys(info).length > 0 ? info : undefined;
  }

  private isCompanyLine(line: string): boolean {
    return !!(
      line.match(/^(company|inc|llc|technologies|software|systems)/i) ||
      (line.includes('|') && line.split('|').length >= 2) ||
      line.match(/(developer|engineer|architect|lead|manager)/i)
    );
  }

  private isProjectName(line: string): boolean {
    return !!(
      line.match(/^[A-Z][A-Za-z\s]{2,}$/) && // Capitalized words
      line.length > 3 &&
      line.length < 50 &&
      !line.match(/[.!?]$/) // No sentence enders
    );
  }

  calculateActionVerbScore(description: string): number {
    const words = description.toLowerCase().split(/\s+/);
    const actionVerbCount = words.filter((word) =>
      this.actionVerbs.has(word),
    ).length;
    return words.length > 0 ? (actionVerbCount / words.length) * 100 : 0;
  }
}
