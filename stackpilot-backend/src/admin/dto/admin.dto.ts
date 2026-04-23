import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminPaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class UsageStatsQueryDto {
  @ApiPropertyOptional({ example: 30, description: 'Days to look back' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 30;

  @ApiPropertyOptional({
    example: 'JOB_SEARCH',
    description: 'Filter by specific action',
  })
  @IsOptional()
  @IsString()
  action?: string;
}

export class CleanupJobsDto {
  @ApiPropertyOptional({
    example: 30,
    description: 'Delete jobs older than X days',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number = 30;
}
