import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { taskRoutes } from './task.routes';

/**
 * Router raíz: cuelga /auth y /tasks del resto de la app.
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export { router as apiRoutes };
