/**
 * Base de los errores que la API sí controla.
 * Cada subclase trae su código HTTP y el middleware de errores lo respeta.
 */
export class AppError extends Error {
  /** Código HTTP que se enviará. */
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
