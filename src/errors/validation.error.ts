import { AppError } from './app-error';

/** Un fallo concreto de AJV, ya traducido. */
export interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

/** 400: los datos de entrada no pasan la validación. */
export class ValidationError extends AppError {
  /** Campo y mensaje de cada fallo. */
  public readonly detalles: ErrorValidacion[];

  constructor(message = 'Datos de entrada inválidos', detalles: ErrorValidacion[] = []) {
    super(400, message);
    this.detalles = detalles;
  }
}
