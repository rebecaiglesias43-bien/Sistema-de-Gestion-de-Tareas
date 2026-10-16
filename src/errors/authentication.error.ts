import { AppError } from './app-error';

/** Error que representa un fallo de autenticación o autorización (HTTP 401). */
export class AuthenticationError extends AppError {
  constructor(message = 'No autenticado o credenciales inválidas') {
    super(401, message);
  }
}
