import { AppError } from './app-error';

/** 401: falta el token, venció o las credenciales no coinciden. */
export class AuthenticationError extends AppError {
  constructor(message = 'No autenticado o credenciales inválidas') {
    super(401, message);
  }
}
