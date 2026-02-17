import { IsOptional, IsBoolean, IsObject } from 'class-validator';
import { StructuredResumeData } from '../entities/resume.entity';

export class UpdateResumeDto {
  @IsOptional()
  @IsObject()
  structuredData?: StructuredResumeData;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
