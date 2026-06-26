import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ApplicationService } from '../services/application.service';

export const getApplications = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page, limit, jobId, status } = req.query;
    
    const result = await ApplicationService.findApplications({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      jobId: jobId ? Number(jobId) : undefined,
      status: status as string
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await ApplicationService.updateApplicationStatus(Number(id), status);

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

    try {
      const application = await ApplicationService.applyForJob(userId, Number(jobId));
      res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (serviceError: any) {
      if (serviceError.message === 'Job not found') {
        return res.status(404).json({ message: serviceError.message });
      }
      if (serviceError.message === 'You have already applied for this job') {
        return res.status(400).json({ message: serviceError.message });
      }
      throw serviceError;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating application' });
  }
};
