import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JSearchQuota } from './src/usage/entities/jsearch-quota.entity';
import { AdzunaQuota } from './src/usage/entities/adzuna-quota.entity';

async function checkQuotas() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const jRepo = app.get(getRepositoryToken(JSearchQuota));
  const aRepo = app.get(getRepositoryToken(AdzunaQuota));

  const jQuota = await jRepo.findOne({ where: { id: 'singleton' } });
  const aQuota = await aRepo.findOne({ where: { id: 'singleton' } });

  console.log('JSearch Quota:', JSON.stringify(jQuota, null, 2));
  console.log('Adzuna Quota:', JSON.stringify(aQuota, null, 2));

  await app.close();
}

checkQuotas();
