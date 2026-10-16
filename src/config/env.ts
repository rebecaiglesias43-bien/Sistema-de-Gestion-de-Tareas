import dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton que carga y centraliza las variables de entorno de la aplicación.
 *
 * Se encarga de leer el archivo `.env` una única vez y exponer los valores
 * necesarios (puerto, conexión a base de datos y configuración de JWT) de
 * forma tipada al resto del proyecto.
 */
class Config {
  private static instance: Config;

  /** Puerto HTTP en el que escucha el servidor. */
  public readonly puerto: number;

  /** Cadena de conexión a PostgreSQL. */
  public readonly urlBaseDatos: string;

  /** Secreto usado para firmar y verificar los JSON Web Tokens. */
  public readonly secretoJwt: string;

  /** Tiempo de expiración de los tokens (formato `jsonwebtoken`). */
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

  /** Obtiene la única instancia de la configuración, creándola si no existe. */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private parsePuerto(valor: string | undefined): number {
    const puerto = Number.parseInt(valor ?? '3000', 10);
    if (Number.isNaN(puerto)) {
      throw new Error('La variable de entorno PUERTO debe ser un número');
    }
    return puerto;
  }
}

export const config = Config.getInstance();
