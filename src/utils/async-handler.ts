import { Request, Response, NextFunction, RequestHandler } from 'express';

type Controlador = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Express 4 no captura los errores de funciones async; esto los manda a next().
 */
export function asyncHandler(fn: Controlador): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
