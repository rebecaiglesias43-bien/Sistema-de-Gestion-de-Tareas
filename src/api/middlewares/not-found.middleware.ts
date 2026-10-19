import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';

/** Responde 404 cuando ninguna ruta coincidió. */
export function notFoundHandler(_req: Request, _res: Response, next: (err: unknown) => void): void {
  next(new NotFoundError('Ruta no encontrada'));
}
