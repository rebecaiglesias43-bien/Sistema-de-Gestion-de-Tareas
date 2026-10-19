import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración de la app, cargada una sola vez.
 *
 * Si falta algo crítico, el proceso falla al arrancar en vez de
 * arrastrar el error hasta la primera petición.
 */
class Config {
  private static instance: Config;

  /** Puerto HTTP. */
  public readonly puerto: number;

  /** Cadena de conexión de PostgreSQL. */
  public readonly urlBaseDatos: string;

  /** Secreto con el que se firman los JWT. */
  public readonly secretoJwt: string;

  /** Duración del token, en formato de jsonwebtoken (1h, 30m...). */
  public readonly expiracionJwt: string;

  private constructor() {
    this.puerto = this.parsePuerto(process.env.PUERTO);
    this.urlBaseDatos = process.env.URL_BASE_DATOS ?? '';
    this.secretoJwt = process.env.SECRETO_JWT ?? '';
    this.expiracionJwt = process.env.EXPIRACION_JWT ?? '1h';

    if (!this.urlBaseDatos) {
      throw new Error('Falta la variable de entorno URL_BASE_DATOS');
    }
    if (!this.secretoJwt) {
      throw new Error('Falta la variable de entorno SECRETO_JWT');
    }
  }

  /** Devuelve la instancia única y la crea la primera vez. */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /** Convierte PUERTO a número; si no es válido, corta el arranque. */
  private parsePuerto(valor: string | undefined): number {
    const puerto = Number.parseInt(valor ?? '3000', 10);
    if (Number.isNaN(puerto)) {
      throw new Error('La variable de entorno PUERTO debe ser un número');
    }
    return puerto;
  }
}

export const config = Config.getInstance();
