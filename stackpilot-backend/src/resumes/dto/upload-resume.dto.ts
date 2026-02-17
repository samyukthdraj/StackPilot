import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UploadResumeDto {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsBoolean()
  setAsPrimary?: boolean;
}
