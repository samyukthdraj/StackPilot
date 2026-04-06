import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobMatch } from '../entities/job-match.entity';
import { Resume } from '../../resumes/entities/resume.entity';
import { JSearchService } from './jsearch.service';
import { JobSyncService } from './job-sync.service';
import { EmailService } from '../../email/email.service';
import { User } from '../../users/user.entity';

export interface MatchScore {
  jobId: string;
  score: number;
  breakdown: {
    skillMatch: number;
    keywordScore: number;
    experienceScore: number;
    recencyScore: number;
    total: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ExperienceItem {
  title?: string;
  description: string[];
}

@Injectable()
export class JobMatchingService {
  private readonly logger = new Logger(JobMatchingService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobMatch)
    private jobMatchRepository: Repository<JobMatch>,
    private jsearchService: JSearchService,
    private jobSyncService: JobSyncService,
    private emailService: EmailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  calculateMatchScore(resume: Resume, job: Job): MatchScore {
    try {
      const resumeSkills = resume.structuredData?.skills || [];
      const jobSkills = job.requiredSkills || [];

      // Calculate skill match (60% of total)
      const { skillMatch, matchedSkills, missingSkills } =
        this.calculateSkillMatch(resumeSkills, jobSkills);

      // Calculate keyword score from description (25% of total)
      const keywordScore = this.calculateKeywordScore(
        resume.rawText,
        job.description || '',
      );

      // Calculate experience relevance (10% of total)
      const experienceScore = this.calculateExperienceScore(
        resume.structuredData?.experience || [],
        job.title,
      );

      // Calculate recency score (5% of total)
      const recencyScore = this.calculateRecencyScore(job.postedAt);

      // Final score (re-weighted to prioritize user experience and title)
      let total =
        skillMatch * 0.3 +
        experienceScore * 0.5 +
        keywordScore * 0.15 +
        recencyScore * 0.05;

      // Hard penalty: If the specific job role/title has no semantic overlap with their past experience,
      // heavily slash the total score so it drops below the 60% visibility threshold.
      if (experienceScore < 20) {
        total = total * 0.5;
      }

      total = Math.round(total);

      return {
        jobId: job.id,
        score: Math.min(100, Math.max(0, total)),
        breakdown: {
          skillMatch: Math.round(skillMatch),
          keywordScore: Math.round(keywordScore),
          experienceScore: Math.round(experienceScore),
          recencyScore: Math.round(recencyScore),
          total: Math.round(total),
        },
        matchedSkills,
        missingSkills,
      };
    } catch (error) {
      this.logger.error('Error calculating match score:', error);
      return {
        jobId: job.id,
        score: 0,
        breakdown: {
          skillMatch: 0,
          keywordScore: 0,
          experienceScore: 0,
          recencyScore: 0,
          total: 0,
        },
        matchedSkills: [],
        missingSkills: [],
      };
    }
  }

  private calculateSkillMatch(
    resumeSkills: string[],
    jobSkills: string[],
  ): {
    skillMatch: number;
    matchedSkills: string[];
    missingSkills: string[];
  } {
    if (!jobSkills.length) {
      return { skillMatch: 0, matchedSkills: [], missingSkills: [] };
    }

    const resumeSkillSet = new Set(resumeSkills.map((s) => s.toLowerCase()));

    const matchedSkills = jobSkills.filter((skill) =>
      resumeSkillSet.has(skill.toLowerCase()),
    );

    const missingSkills = jobSkills.filter(
      (skill) => !resumeSkillSet.has(skill.toLowerCase()),
    );

    const matchPercentage = (matchedSkills.length / jobSkills.length) * 100;

    // Bonus for matching all required skills
    const bonus = matchedSkills.length === jobSkills.length ? 20 : 0;

    return {
      skillMatch: Math.min(100, matchPercentage + bonus),
      matchedSkills,
      missingSkills,
    };
  }

  private calculateKeywordScore(
    resumeText: string,
    jobDescription: string,
  ): number {
    if (!jobDescription) return 0;

    const resumeWords = new Set(
      resumeText
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3),
    );

    const descriptionWords = new Set(
      jobDescription
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3 && !this.isCommonWord(w)),
    );

    if (descriptionWords.size === 0) return 0;

    const matchedKeywords = Array.from(descriptionWords).filter((word) =>
      resumeWords.has(word),
    );

    const matchPercentage =
      (matchedKeywords.length / descriptionWords.size) * 100;

    return Math.min(100, matchPercentage);
  }

  private calculateExperienceScore(
    experience: ExperienceItem[],
    jobTitle: string,
  ): number {
    if (!experience.length) return 0;

    const jobTitleKeywords = jobTitle.toLowerCase().split(/\W+/);
    if (jobTitleKeywords.length === 0) return 0;

    let maxRelevance = 0;

    for (const exp of experience) {
      if (exp.title) {
        const titleWords = exp.title.toLowerCase().split(/\W+/);
        const titleRelevance =
          (jobTitleKeywords.filter((word) =>
            titleWords.some((tw) => tw.includes(word) || word.includes(tw)),
          ).length /
            jobTitleKeywords.length) *
          100;

        maxRelevance = Math.max(maxRelevance, titleRelevance);
      }

      // Check description for relevance
      if (exp.description.length > 0) {
        const description = exp.description.join(' ').toLowerCase();
        const descriptionRelevance =
          (jobTitleKeywords.filter((word) => description.includes(word))
            .length /
            jobTitleKeywords.length) *
          50; // Half weight for description

        maxRelevance = Math.max(maxRelevance, descriptionRelevance);
      }
    }

    return Math.min(100, maxRelevance);
  }

  private calculateRecencyScore(postedAt?: Date): number {
    if (!postedAt) return 50;

    const daysOld = Math.floor(
      (Date.now() - postedAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysOld <= 7) return 100;
    if (daysOld <= 14) return 80;
    if (daysOld <= 30) return 60;
    if (daysOld <= 60) return 40;
    return 20;
  }

  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'the',
      'and',
      'for',
      'with',
      'this',
      'that',
      'from',
      'your',
      'have',
      'will',
      'work',
      'team',
      'role',
      'position',
      'job',
      'company',
      'experience',
      'skills',
    ]);
    return commonWords.has(word);
  }

  async findMatchesForResume(
    resume: Resume,
    limit: number = 20,
  ): Promise<MatchScore[]> {
    try {
      // Fetch some real-time jobs based on top resume skills first
      let searchQuery = '';
      const exp = resume.structuredData?.experience;
      const skills = resume.structuredData?.skills;

      // Prioritize the most recent job title as the main target role
      if (exp && exp.length > 0 && exp[0].title) {
        searchQuery = exp[0].title;
        // Add the top skill to make the search more precise
        if (skills && skills.length > 0) {
          searchQuery += ` ${skills[0]}`;
        }
      } else if (skills && skills.length > 0) {
        searchQuery = skills.slice(0, 3).join(' ');
      }

      if (searchQuery) {
        try {
          const jJobs = await this.jsearchService.searchJobs(searchQuery, 'us');

          if (jJobs && jJobs.length > 0) {
            // Save them to local DB so calculating match works easily
            for (const jSearchJob of jJobs.slice(0, 30)) {
              await this.jobSyncService.saveJob(jSearchJob as any, 'us');
            }
          }
        } catch (e) {
          this.logger.error(
            'Failed to pre-fetch real-time jobs from Adzuna:',
            e,
          );
        }
      }

      // Get recent jobs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const jobs = await this.jobRepository.find({
        where: {
          postedAt: LessThan(new Date()), // Get jobs posted up to now
        },
        order: {
          postedAt: 'DESC',
        },
        take: 100, // Limit to 100 jobs for performance
      });

      const matches: MatchScore[] = [];

      for (const job of jobs) {
        // Self-healing: if experience is missing, try to re-extract it from the stored description
        if (
          job.experienceRequiredMin === null ||
          job.experienceRequiredMin === undefined
        ) {
          const extracted =
            this.jobSyncService.extractExperienceFromDescription(
              job.description || '',
              job.title,
            );
          if (extracted.min !== undefined) {
            job.experienceRequiredMin = extracted.min;
            job.experienceRequiredMax = extracted.max;
            // Update DB asynchronously so we don't delay the response
            this.jobRepository
              .update(job.id, {
                experienceRequiredMin: extracted.min,
                experienceRequiredMax: extracted.max,
              })
              .catch((err) =>
                this.logger.error(
                  `Failed to self-heal exp for job ${job.id}`,
                  err,
                ),
              );
          }
        }
        const match = this.calculateMatchScore(resume, job);
        matches.push(match);
      }

      // Sort by score and return top matches
      return matches.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      this.logger.error('Error finding matches for resume:', error);
      return [];
    }
  }

  async saveMatch(userId: string, match: MatchScore): Promise<void> {
    try {
      // Check if match already exists
      const existingMatch = await this.jobMatchRepository.findOne({
        where: {
          userId,
          jobId: match.jobId,
        },
      });

      // Sanitize score and breakdown to prevent database "Value is out of range" or JSON errors
      const sanitizedScore = isFinite(match.score) ? match.score : 0;
      const sanitizedBreakdown = {
        skillMatch: isFinite(match.breakdown.skillMatch)
          ? match.breakdown.skillMatch
          : 0,
        keywordScore: isFinite(match.breakdown.keywordScore)
          ? match.breakdown.keywordScore
          : 0,
        experienceScore: isFinite(match.breakdown.experienceScore)
          ? match.breakdown.experienceScore
          : 0,
        recencyScore: isFinite(match.breakdown.recencyScore)
          ? match.breakdown.recencyScore
          : 0,
        total: isFinite(match.breakdown.total ?? match.score)
          ? (match.breakdown.total ?? match.score)
          : 0,
      };

      if (existingMatch) {
        // Update existing match
        await this.jobMatchRepository.update(
          { id: existingMatch.id },
          {
            score: sanitizedScore,
            scoreBreakdown: sanitizedBreakdown,
            matchedSkills: match.matchedSkills,
            missingSkills: match.missingSkills,
            viewed: false, // Reset viewed status on new match
          },
        );
      } else {
        // Create new match
        const jobMatch = this.jobMatchRepository.create({
          userId,
          jobId: match.jobId,
          score: sanitizedScore,
          scoreBreakdown: sanitizedBreakdown,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
        });

        await this.jobMatchRepository.save(jobMatch);
      }

      // Automation: Trigger Instant Match Alert for 68%+ matches
      if (sanitizedScore >= 68) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (user?.notificationPreferences?.email?.newMatches) {
          const job = await this.jobRepository.findOne({
            where: { id: match.jobId },
          });
          if (job) {
            void this.emailService.sendJobMatchesEmail(
              user.email,
              user.name || 'User',
              [
                {
                  title: job.title,
                  company: job.company,
                  location: job.location,
                  score: sanitizedScore,
                  matchedSkills: match.matchedSkills,
                  missingSkills: match.missingSkills,
                  url: job.jobUrl || 'https://stackpilot.com/jobs',
                },
              ],
            );
            this.logger.log(
              `Instant match alert triggered for user ${userId} for job ${job.id}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error('Error saving job match:', error);
    }
  }
}
