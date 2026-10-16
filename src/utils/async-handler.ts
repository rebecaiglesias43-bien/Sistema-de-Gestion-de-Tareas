import { Request, Response, NextFunction, RequestHandler } from 'express';

type Controlador = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envuelve un controlador asíncrono para que los rechazos de promesas sean
 * delegados al middleware de errores (Express 4 no lo hace automáticamente).
 */
export function asyncHandler(fn: Controlador): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
