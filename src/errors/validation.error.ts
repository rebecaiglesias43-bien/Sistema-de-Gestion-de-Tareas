import { AppError } from './app-error';

/** Detalle de un fallo de validación devuelto por AJV. */
export interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

/** Error que representa datos de entrada inválidos (HTTP 400). */
export class ValidationError extends AppError {
  /** Lista de errores concretos detectados durante la validación. */
  public readonly detalles: ErrorValidacion[];

  constructor(message = 'Datos de entrada inválidos', detalles: ErrorValidacion[] = []) {
    super(400, message);
    this.detalles = detalles;
  }
}
