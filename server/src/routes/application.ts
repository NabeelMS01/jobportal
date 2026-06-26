import { Router } from 'express';
import { getApplications, updateApplicationStatus, createApplication } from '../controllers/application.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getApplications);
router.post('/', authenticate, createApplication);
router.put('/:id/status', authenticate, updateApplicationStatus);

export default router;
