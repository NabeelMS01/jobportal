import { Router } from 'express';
import { getApplications, updateApplicationStatus, createApplication } from '../controllers/application.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authenticate, getApplications);
router.post('/', authenticate, createApplication);
router.put('/:id/status', authenticate, authorize(['ADMIN']), updateApplicationStatus);

export default router;
