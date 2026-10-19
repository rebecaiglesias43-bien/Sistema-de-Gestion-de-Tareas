import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/async-handler';
import { RegistroInput, LoginInput } from '../schemas/auth.schemas';

/**
 * Entrada HTTP del módulo de autenticación.
 * No hay lógica aquí: solo se llama al servicio y se arma la respuesta.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register */
  registrar = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, email, password } = req.body as RegistroInput;
    const usuario = await this.authService.registrar(nombre, email, password);
    res.status(201).json({ usuario });
  });

  /** POST /auth/login */
  iniciarSesion = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;
    const { token, usuario } = await this.authService.iniciarSesion(email, password);
    res.json({ token, usuario });
  });
}
