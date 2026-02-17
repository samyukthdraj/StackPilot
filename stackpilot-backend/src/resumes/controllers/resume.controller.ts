import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from '../services/resume.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserId } from '../../auth/user-id.decorator';
import { UploadResumeDto } from '../dto/upload-resume.dto';
import { UpdateResumeDto } from '../dto/update-resume.dto';
import { ResumeResponseDto } from '../dto/resume-response.dto';
import { MulterFile } from '../../types/multer-file.interface';
import { UsageLimit } from '../../usage/decorators/usage-limit.decorator';
import { UsageAction } from '../../usage/entities/usage-log.entity';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsageLimit(UsageAction.RESUME_SCAN, 3, 'day')
  async uploadResume(
    @UserId() userId: string,
    @UploadedFile() file: MulterFile,
    @Body() uploadDto: UploadResumeDto,
  ): Promise<ResumeResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const resume = await this.resumeService.uploadResume(
      userId,
      file,
      uploadDto,
    );
    return ResumeResponseDto.fromEntity(resume);
  }

  @Get()
  async getUserResumes(@UserId() userId: string): Promise<ResumeResponseDto[]> {
    const resumes = await this.resumeService.getUserResumes(userId);
    return resumes.map((resume) => ResumeResponseDto.fromEntity(resume));
  }

  @Get('primary')
  async getPrimaryResume(
    @UserId() userId: string,
  ): Promise<ResumeResponseDto | null> {
    const resume = await this.resumeService.getPrimaryResume(userId);
    return resume ? ResumeResponseDto.fromEntity(resume) : null;
  }

  @Get(':id')
  async getResumeById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<ResumeResponseDto> {
    const resume = await this.resumeService.getResumeById(id, userId);
    return ResumeResponseDto.fromEntity(resume);
  }

  @Patch(':id')
  async updateResume(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() updateDto: UpdateResumeDto,
  ): Promise<ResumeResponseDto> {
    const resume = await this.resumeService.updateResume(id, userId, updateDto);
    return ResumeResponseDto.fromEntity(resume);
  }

  @Delete(':id')
  async deleteResume(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<{ message: string }> {
    await this.resumeService.deleteResume(id, userId);
    return { message: 'Resume deleted successfully' };
  }
}
