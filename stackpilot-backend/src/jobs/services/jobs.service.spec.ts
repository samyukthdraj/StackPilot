import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { Job } from '../entities/job.entity';
import { JSearchQuota } from '../../usage/entities/jsearch-quota.entity';
import { JSearchService } from './jsearch.service';
import { JobSyncService } from './job-sync.service';
import { UsageService } from '../../usage/services/usage.service';

describe('JobsService', () => {
  let service: JobsService;
  let jobRepository: any;

  const mockJobRepository = {
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      setParameters: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    })),
    findOne: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
  };

  const mockQuotaRepository = {
    findOne: jest.fn().mockResolvedValue({
      requestsRemaining: 10,
      requestsReset: Date.now() / 1000 + 3600,
    }),
  };

  const mockJSearchService = {};
  const mockJobSyncService = {
    extractExperienceFromDescription: jest
      .fn()
      .mockReturnValue({ min: 1, max: 2 }),
  };
  const mockUsageService = {
    trackUsage: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockJobRepository,
        },
        {
          provide: getRepositoryToken(JSearchQuota),
          useValue: mockQuotaRepository,
        },
        {
          provide: JSearchService,
          useValue: mockJSearchService,
        },
        {
          provide: JobSyncService,
          useValue: mockJobSyncService,
        },
        {
          provide: UsageService,
          useValue: mockUsageService,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobRepository = module.get(getRepositoryToken(Job));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findJobs', () => {
    it('should return jobs and total count', async () => {
      const result = await service.findJobs({ limit: 10, offset: 0 });
      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('total');
      expect(jobRepository.createQueryBuilder).toHaveBeenCalledWith('job');
    });

    it('should track usage if userId and search term are provided', async () => {
      await service.findJobs({ search: 'developer' }, 'user-123');
      expect(mockUsageService.trackUsage).toHaveBeenCalled();
    });
  });
});
