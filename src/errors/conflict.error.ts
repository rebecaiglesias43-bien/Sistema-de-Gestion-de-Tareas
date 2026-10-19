import { AppError } from './app-error';

/** 409: el recurso choca con algo que ya existe (email repetido). */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(409, message);
  }
}
