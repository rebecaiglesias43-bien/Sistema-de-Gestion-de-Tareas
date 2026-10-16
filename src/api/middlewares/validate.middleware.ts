import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ErrorObject } from 'ajv';
import { ajv } from '../../schemas/ajv';
import { ValidationError, ErrorValidacion } from '../../errors/validation.error';

/**
 * Transforma los errores de AJV en el formato `ErrorValidacion` usado por la
 * aplicación, mostrando la ruta del campo fallido y un mensaje legible.
 */
function mapearErrores(errors: ErrorObject[] | null | undefined): ErrorValidacion[] {
  return (errors ?? []).map((e) => ({
    campo: e.instancePath ? e.instancePath.replace(/^\//, '') : 'cuerpo',
    mensaje: e.message ?? 'Valor inválido',
  }));
}

/**
 * Middleware que valida el cuerpo de la petición contra un esquema JSONSchema.
 *
 * Si la validación falla, delega el error al middleware centralizado de
 * errores lanzando un `ValidationError`.
 */
export function validateBody(schema: object): RequestHandler {
  const validar = ajv.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (validar(req.body)) {
      return next();
    }
    next(new ValidationError('Datos de entrada inválidos', mapearErrores(validar.errors)));
  };
}

/**
 * Middleware que valida los parámetros de ruta contra un esquema JSONSchema.
 */
export function validateParams(schema: object): RequestHandler {
  const validar = ajv.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (validar(req.params)) {
      return next();
    }
    next(new ValidationError('Parámetros de ruta inválidos', mapearErrores(validar.errors)));
  };
}
