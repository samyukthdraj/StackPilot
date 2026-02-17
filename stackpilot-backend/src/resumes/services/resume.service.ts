import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { User } from '../../users/user.entity';
import { UploadResumeDto } from '../dto/upload-resume.dto';
import { UpdateResumeDto } from '../dto/update-resume.dto';
import { ResumeParserService } from './resume-parser.service';
import { ATSScoringService } from './ats-scoring.service';
import { MulterFile } from '../../types/multer-file.interface';
import pdfParse from 'pdf-parse';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private resumeParserService: ResumeParserService,
    private atsScoringService: ATSScoringService,
  ) {}

  async uploadResume(
    userId: string,
    file: MulterFile,
    uploadDto: UploadResumeDto,
  ): Promise<Resume> {
    try {
      // Check user's daily scan limit
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.subscriptionType === 'free' && user.dailyResumeScans >= 3) {
        throw new ForbiddenException(
          'Daily resume scan limit reached (3 per day)',
        );
      }

      // Validate file
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size too large (max 5MB)');
      }

      // Parse PDF
      let pdfData: Awaited<ReturnType<typeof pdfParse>>;
      try {
        pdfData = await pdfParse(file.buffer);
      } catch (error) {
        this.logger.error('Error parsing PDF:', error);
        throw new BadRequestException('Invalid PDF file');
      }

      const rawText = pdfData.text;

      if (!rawText || rawText.trim().length === 0) {
        throw new BadRequestException('No text content found in PDF');
      }

      // Parse resume structure
      const structuredData = this.resumeParserService.parseResume(rawText);

      // Calculate ATS score
      const scoreBreakdown =
        this.atsScoringService.calculateScore(structuredData);

      // If setAsPrimary is true, unset any existing primary resumes
      if (uploadDto.setAsPrimary) {
        await this.resumeRepository.update(
          { userId, isPrimary: true },
          { isPrimary: false },
        );
      }

      // Create resume record
      const resume = this.resumeRepository.create({
        userId,
        fileName: uploadDto.fileName || file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        rawText,
        structuredData,
        atsScore: scoreBreakdown.total,
        scoreBreakdown,
        isPrimary: uploadDto.setAsPrimary || false,
        version: 1,
      });

      const savedResume = await this.resumeRepository.save(resume);

      // Update user's daily scan count
      const today = new Date().toDateString();
      const lastReset = user.lastScanReset
        ? user.lastScanReset.toDateString()
        : null;

      if (lastReset !== today) {
        // Reset counter for new day
        await this.userRepository.update(userId, {
          dailyResumeScans: 1,
          lastScanReset: new Date(),
        });
      } else {
        // Increment existing counter
        await this.userRepository.update(userId, {
          dailyResumeScans: user.dailyResumeScans + 1,
        });
      }

      return savedResume;
    } catch (error) {
      this.logger.error('Error uploading resume:', error);
      throw error;
    }
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return this.resumeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getResumeById(id: string, userId: string): Promise<Resume> {
    const resume = await this.resumeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return resume;
  }

  async updateResume(
    id: string,
    userId: string,
    updateDto: UpdateResumeDto,
  ): Promise<Resume> {
    const resume = await this.getResumeById(id, userId);

    // If setting as primary, unset others
    if (updateDto.isPrimary === true) {
      await this.resumeRepository.update(
        { userId, isPrimary: true },
        { isPrimary: false },
      );
    }

    // Update fields
    if (updateDto.structuredData) {
      resume.structuredData = updateDto.structuredData;
      // Recalculate score if data changed
      const newScore = this.atsScoringService.calculateScore(
        updateDto.structuredData,
      );
      resume.atsScore = newScore.total;
      resume.scoreBreakdown = newScore;
      resume.version += 1;
    }

    if (updateDto.isPrimary !== undefined) {
      resume.isPrimary = updateDto.isPrimary;
    }

    return this.resumeRepository.save(resume);
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    const resume = await this.getResumeById(id, userId);
    await this.resumeRepository.remove(resume);
  }

  async getPrimaryResume(userId: string): Promise<Resume | null> {
    return this.resumeRepository.findOne({
      where: { userId, isPrimary: true },
    });
  }
}
