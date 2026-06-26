import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers);

export default router;
