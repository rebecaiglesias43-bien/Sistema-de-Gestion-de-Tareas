import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorObject } from 'ajv';
import { ajv } from '../../schemas/ajv';
import { ValidationError, ErrorValidacion } from '../../errors/validation.error';

/**
 * Pasa los errores de AJV a un formato con campo y mensaje.
 */
function mapearErrores(errors: ErrorObject[] | null | undefined): ErrorValidacion[] {
  return (errors ?? []).map((e) => ({
    campo: e.instancePath ? e.instancePath.replace(/^\//, '') : 'cuerpo',
    mensaje: e.message ?? 'Valor inválido',
  }));
}

/** Valida el body contra el esquema y, si falla, lanza ValidationError. */
export function validateBody(schema: object): RequestHandler {
  const validar = ajv.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (validar(req.body)) {
      return next();
    }
    next(new ValidationError('Datos de entrada inválidos', mapearErrores(validar.errors)));
  };
}

/** Igual que validateBody, pero para req.params. */
export function validateParams(schema: object): RequestHandler {
  const validar = ajv.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (validar(req.params)) {
      return next();
    }
    next(new ValidationError('Parámetros de ruta inválidos', mapearErrores(validar.errors)));
  };
}
