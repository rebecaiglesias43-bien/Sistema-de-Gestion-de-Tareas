import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';

/** Middleware que responde 404 cuando ninguna ruta coincide. */
export function notFoundHandler(_req: Request, _res: Response, next: (err: unknown) => void): void {
  next(new NotFoundError('Ruta no encontrada'));
}
