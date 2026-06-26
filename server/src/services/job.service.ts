import prisma from '../utils/db';
import { Job } from '@prisma/client';
import { CacheService } from './cache.service';

export class JobService {
  static async findJobs(query: { page?: number | undefined; limit?: number | undefined; category?: string | undefined; experienceLevel?: string | undefined }) {
    const { page = 1, limit = 10, category, experienceLevel } = query;
    
    const where: any = {};
    if (category) where.category = category;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    const skip = (Number(page) - 1) * Number(limit);
    
    const cacheKey = `jobs:${page}:${limit}:${category || 'all'}:${experienceLevel || 'all'}`;
    const cachedData = await CacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    const result = {
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };

    // Cache for 5 minutes
    await CacheService.set(cacheKey, result, 300);

    return result;
  }

  static async findJobById(id: number): Promise<Job | null> {
    const cacheKey = `job:${id}`;
    const cachedJob = await CacheService.get<Job>(cacheKey);
    if (cachedJob) return cachedJob;

    const job = await prisma.job.findUnique({ where: { id } });
    if (job) {
      await CacheService.set(cacheKey, job, 300);
    }
    return job;
  }

  static async createJob(data: any): Promise<Job> {
    const job = await prisma.job.create({ data });
    await CacheService.delPattern('jobs:*');
    return job;
  }

  static async updateJob(id: number, data: any): Promise<Job> {
    const job = await prisma.job.update({
      where: { id },
      data
    });
    await CacheService.delPattern('jobs:*');
    await CacheService.del(`job:${id}`);
    return job;
  }

  static async deleteJob(id: number): Promise<void> {
    await prisma.job.delete({ where: { id } });
    await CacheService.delPattern('jobs:*');
    await CacheService.del(`job:${id}`);
  }
}
