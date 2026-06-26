import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

export const getApplications = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10, jobId, status } = req.query;
    
    const where: any = {};
    if (jobId) where.jobId = Number(jobId);
    if (status) where.status = status as string;

    const skip = (Number(page) - 1) * Number(limit);
    
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

    res.status(200).json({
      applications,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company: true } }
      }
    });

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if application already exists
    const existingApplication = await prisma.application.findFirst({
      where: { userId, jobId: Number(jobId) }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        jobId: Number(jobId),
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Error creating application' });
  }
};
