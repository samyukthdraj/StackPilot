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

      if (user.subscriptionType === 'free' && user.dailyResumeScans >= 99) {
        throw new ForbiddenException(
          'Daily resume scan limit reached (99 per day)',
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

      // Parse PDF using pdfjs-dist via dynamic import (avoids ESM/CJS conflict)
      let rawText = '';
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        // Critical for Node.js: disable web worker
        pdfjs.GlobalWorkerOptions.workerSrc = '';
        const uint8Array = new Uint8Array(file.buffer);
        const loadingTask = pdfjs.getDocument({
          data: uint8Array,
          useWorkerFetch: false,
          isEvalSupported: false,
          useSystemFonts: true,
          disableAutoFetch: true,
          disableStream: true,
        });
        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        const pageTexts: string[] = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const items = textContent.items as Array<{ str?: string }>;
          const pageText = items.map((item) => item.str ?? '').join(' ');
          pageTexts.push(pageText);
        }

        rawText = pageTexts
          .join('\n')
          // eslint-disable-next-line no-control-regex
          .replace(/\u0000/g, '')
          .trim();
        this.logger.log(
          `Extracted ${rawText.length} chars from ${numPages} pages`,
        );
        // Log a sample of raw text to debug why ATS score might be 0
        this.logger.debug(`Raw text sample: ${rawText.substring(0, 100)}...`);
      } catch (pdfError: unknown) {
        const msg =
          pdfError instanceof Error ? pdfError.message : String(pdfError);
        this.logger.error('Error parsing PDF with pdfjs-dist:', msg);
        rawText = '';
      }

      if (!rawText || rawText.trim().length === 0) {
        this.logger.warn(
          'No text content could be extracted from PDF. Saving with empty text.',
        );
        rawText = 'Unparsable PDF';
      }

      // Store base64-encoded PDF so users can view it later and for AI parsing
      const fileData = file.buffer.toString('base64');

      // Parse resume structure visually directly from the PDF
      const structuredData = await this.resumeParserService.parseResume(
        fileData,
        file.mimetype || 'application/pdf',
      );

      // Calculate ATS score
      const scoreBreakdown = await this.atsScoringService.calculateScore(
        structuredData,
        uploadDto.targetJobDescription,
      );

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
        fileData,
        structuredData,
        atsScore: scoreBreakdown.total,
        scoreBreakdown,
        targetJobDescription: uploadDto.targetJobDescription,
        isPrimary: uploadDto.setAsPrimary || false,
        version: 1,
      });

      const savedResume = await this.resumeRepository.save(resume);

      // Update user's daily scan count
      const today = new Date().toDateString();
      const lastReset = user.lastScanReset
        ? new Date(user.lastScanReset).toDateString()
        : null;

      if (lastReset !== today) {
        await this.userRepository.update(userId, {
          dailyResumeScans: 1,
          lastScanReset: new Date(),
        });
      } else {
        await this.userRepository.update(userId, {
          dailyResumeScans: (user.dailyResumeScans || 0) + 1,
        });
      }

      return savedResume;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? (error.stack ?? error.message) : String(error);
      this.logger.error('Error uploading resume:', message);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(message);
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
    if (updateDto.targetJobDescription !== undefined) {
      resume.targetJobDescription = updateDto.targetJobDescription;
    }

    if (updateDto.structuredData) {
      resume.structuredData = updateDto.structuredData;
    }

    if (
      updateDto.structuredData ||
      updateDto.targetJobDescription !== undefined
    ) {
      if (resume.structuredData) {
        // Recalculate score if data or job description changed
        const newScore = await this.atsScoringService.calculateScore(
          resume.structuredData,
          resume.targetJobDescription,
        );
        resume.atsScore = newScore.total;
        resume.scoreBreakdown = newScore;
        resume.version += 1;
      }
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

  async getResumeFileData(
    id: string,
    userId: string,
  ): Promise<{ fileData: string; fileName: string; mimeType: string }> {
    const resume = await this.resumeRepository.findOne({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException('Access denied');
    if (!resume.fileData)
      throw new NotFoundException('File data not stored for this resume');
    return {
      fileData: resume.fileData,
      fileName: resume.fileName ?? 'resume.pdf',
      mimeType: resume.mimeType ?? 'application/pdf',
    };
  }
}
