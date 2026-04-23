import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class UpdateNameDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The new name for the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export interface NotificationPreferences {
  email: {
    dailyDigest: boolean;
    newMatches: boolean;
    applicationReminders: boolean;
    marketing: boolean;
  };
  push: {
    newMatches: boolean;
    applicationUpdates: boolean;
  };
}

export class UpdateNotificationSettingsDto {
  @ApiProperty({
    example: {
      email: {
        dailyDigest: true,
        newMatches: true,
        applicationReminders: true,
        marketing: false,
      },
      push: { newMatches: true, applicationUpdates: true },
    },
    description: 'Detailed notification preferences',
  })
  @IsObject()
  preferences: NotificationPreferences;
}

export class ActivityChartDto {
  @ApiProperty({
    example: 30,
    description: 'Number of days to look back for activity',
  })
  @IsOptional()
  days?: number = 30;
}
