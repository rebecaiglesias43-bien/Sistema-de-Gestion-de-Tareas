import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../persistence/repositories/user.repository';
import { validateBody } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../../schemas/auth.schemas';

const router = Router();
const authController = new AuthController(new AuthService(new UserRepository()));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El correo ya se encuentra registrado
 */
router.post('/register', validateBody(registerSchema), authController.registrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Credenciales válidas, devuelve el token
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateBody(loginSchema), authController.iniciarSesion);

export { router as authRoutes };
