import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors';

/**
 * Middleware centralizado de manejo de errores.
 *
 * Convierte cualquier error lanzado por la aplicación en una respuesta JSON
 * consistente con la forma `{ error: { mensaje, ... } }`. Los errores
 * controlados (`AppError`) usan su código de estado; el resto se trata como
 * un error interno (500) y se registra en la consola.
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
