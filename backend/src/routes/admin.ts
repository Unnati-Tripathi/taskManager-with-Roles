import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/admin';
import { getDashboardAnalytics } from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.use(isAdmin);

router.get('/dashboard', getDashboardAnalytics);

export default router;
