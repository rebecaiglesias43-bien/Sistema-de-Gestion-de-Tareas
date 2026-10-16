import { AppError } from './app-error';

/** Error que representa un conflicto de estado, por ejemplo un email ya registrado (HTTP 409). */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(409, message);
  }
}
