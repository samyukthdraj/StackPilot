import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

export class SaveJobDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateSavedJobDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  applied?: boolean;

  @IsOptional()
  @IsString()
  applicationNotes?: string;
}
