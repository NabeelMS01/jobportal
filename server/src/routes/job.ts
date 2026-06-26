import { Router } from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin only routes
router.post('/', authenticate, createJob);
router.put('/:id', authenticate, updateJob);
router.delete('/:id', authenticate, deleteJob);

export default router;
