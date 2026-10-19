import { AppError } from './app-error';

/** 404: el recurso no existe o no es del usuario. */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(404, message);
  }
}
