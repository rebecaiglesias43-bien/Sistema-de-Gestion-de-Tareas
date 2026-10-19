import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors';

/**
 * Último middleware de la cadena: traduce los errores a JSON.
 *
 * Los AppError salen con su código; cualquier otra cosa se registra y
 * se responde como 500 para no filtrar detalles internos.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { mensaje: err.message };
    if ('detalles' in err && (err as { detalles?: unknown }).detalles) {
      body.detalles = (err as { detalles: unknown }).detalles;
    }
    res.status(err.statusCode).json({ error: body });
    return;
  }

  console.error('Error no controlado:', err);
  res.status(500).json({ error: { mensaje: 'Error interno del servidor' } });
}
