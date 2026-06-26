import prisma from '../utils/db';
import { Application } from '@prisma/client';
import { CacheService } from './cache.service';

export class ApplicationService {
  static async findApplications(query: { page?: number | undefined; limit?: number | undefined; jobId?: number | undefined; status?: string | undefined; userId?: number | undefined }) {
    const { page = 1, limit = 10, jobId, status, userId } = query;
    
    const where: any = {};
    if (jobId) where.jobId = Number(jobId);
    if (status) where.status = status;
    if (userId) where.userId = Number(userId);

    const skip = (Number(page) - 1) * Number(limit);
    
    const cacheKey = `applications:${page}:${limit}:${jobId || 'all'}:${status || 'all'}:${userId || 'all'}`;
    const cachedData = await CacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
            }
          }
        }
      }),
      prisma.application.count({ where })
    ]);

    const result = {
      applications,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };

    // Cache for 2 minutes since applications change often
    await CacheService.set(cacheKey, result, 120);

    return result;
  }

  static async updateApplicationStatus(id: number, status: string) {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: true } }
      }
    });
    await CacheService.delPattern('applications:*');
    return application;
  }

  static async applyForJob(userId: number, jobId: number) {
    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new Error('Job not found');
    }

    // Check if application already exists
    const existingApplication = await prisma.application.findFirst({
      where: { userId, jobId }
    });

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        status: 'PENDING'
      }
    });

    await CacheService.delPattern('applications:*');
    return application;
  }
}
