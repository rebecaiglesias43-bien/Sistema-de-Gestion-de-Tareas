/**
 * Clase base para todos los errores controlados de la aplicación.
 *
 * Permite asociar un código de estado HTTP a un error para que el
 * middleware centralizado de errores pueda responder de forma consistente.
 */
export class AppError extends Error {
  /** Código de estado HTTP asociado al error. */
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
