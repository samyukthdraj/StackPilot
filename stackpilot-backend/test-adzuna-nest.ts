import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AdzunaService } from './src/jobs/services/adzuna.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adzunaService = app.get(AdzunaService);

  console.log('Testing AdzunaService...');
  const results = await adzunaService.searchJobs('Software Engineer', 'us', 1);
  console.log('Results length:', results.length);
  if (results.length > 0) {
    console.log('Dates:', results.map(r => r.postedAt));
  } else {
    console.log('No results found. This means error or 0 jobs.');
  }

  await app.close();
}
bootstrap().catch(console.error);
