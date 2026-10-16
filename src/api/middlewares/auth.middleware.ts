import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { JwtPayload } from '../../types';
import { AuthenticationError } from '../../errors';

/**
 * Middleware que protege rutas privadas.
 *
 * Lee el token de la cabecera `Authorization: Bearer <token>`, verifica su
 * firma y validez, y expone la información del usuario en `req.user`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token de autenticación no proporcionado'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, config.secretoJwt) as JwtPayload;
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    next(new AuthenticationError('Token inválido o expirado'));
  }
}
