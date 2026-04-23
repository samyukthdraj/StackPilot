import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageLog } from './entities/usage-log.entity';
import { UsageService } from './services/usage.service';
import { UsageController } from './controllers/usage.controller';
import { JSearchQuota } from './entities/jsearch-quota.entity';
import { AdzunaQuota } from './entities/adzuna-quota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsageLog, JSearchQuota, AdzunaQuota])],
  providers: [UsageService],
  controllers: [UsageController],
  exports: [UsageService],
})
export class UsageModule {}
