import { Router } from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin only routes
router.post('/', authenticate, authorize(['ADMIN']), createJob);
router.put('/:id', authenticate, authorize(['ADMIN']), updateJob);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteJob);

export default router;
