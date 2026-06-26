import { Request, Response } from 'express';
import { JobService } from '../services/job.service';

export const getJobs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page, limit, category, experienceLevel } = req.query;
    const result = await JobService.findJobs({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      category: category as string,
      experienceLevel: experienceLevel as string,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const job = await JobService.findJobById(Number(id));
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
    const job = await JobService.createJob(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const job = await JobService.updateJob(Number(id), req.body);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await JobService.deleteJob(Number(id));
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job' });
  }
};
