import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getJobs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 10, category, experienceLevel } = req.query;
    
    const where: any = {};
    if (category) where.category = category as string;
    if (experienceLevel) where.experienceLevel = experienceLevel as string;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.status(200).json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({ where: { id: Number(id) } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job' });
  }
};

export const createJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const job = await prisma.job.create({ data: req.body });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const job = await prisma.job.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
};
