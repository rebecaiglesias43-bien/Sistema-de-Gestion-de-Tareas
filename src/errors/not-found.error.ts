import { AppError } from './app-error';

/** Error que representa un recurso inexistente (HTTP 404). */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(404, message);
  }
}
