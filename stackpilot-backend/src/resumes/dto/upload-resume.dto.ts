import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadResumeDto {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  setAsPrimary?: boolean;

  @IsOptional()
  @IsString()
  targetJobDescription?: string;
}
