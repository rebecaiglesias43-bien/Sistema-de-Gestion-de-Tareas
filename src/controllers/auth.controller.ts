import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/async-handler';
import { RegistroInput, LoginInput } from '../schemas/auth.schemas';

/**
 * Controlador de autenticación.
 *
 * Se limita a traducir la petición HTTP hacia el servicio correspondiente y a
 * dar formato a la respuesta. No contiene lógica de negocio.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Maneja `POST /auth/register`. */
  registrar = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, email, password } = req.body as RegistroInput;
    const usuario = await this.authService.registrar(nombre, email, password);
    res.status(201).json({ usuario });
  });

  /** Maneja `POST /auth/login`. */
  iniciarSesion = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;
    const { token, usuario } = await this.authService.iniciarSesion(email, password);
    res.json({ token, usuario });
  });
}
