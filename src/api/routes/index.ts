import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { taskRoutes } from './task.routes';

/**
 * Enrutador raíz que agrupa todas las rutas de la API.
 *
 * Se monta en la raíz de la aplicación, exponiendo los prefijos
 * `/auth` y `/tasks`.
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export { router as apiRoutes };
