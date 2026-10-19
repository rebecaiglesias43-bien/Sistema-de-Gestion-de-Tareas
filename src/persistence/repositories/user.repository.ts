import { pool } from '../db';
import { Usuario } from '../../types';

/**
 * Repositorio encargado de la comunicación con la tabla `usuarios`.
 *
 * Aísla las consultas SQL del resto de la aplicación para que los servicios
 * dependan de métodos con intención clara en lugar de sentencias crudas.
 */
/**
 * Columnas de `usr_usuarios` (con el identificador de la tabla como prefijo)
 * expuestas mediante alias con los nombres que consume la API.
 */
const CAMPOS_USUARIO = `
  usr_id AS id,
  usr_nombre AS nombre,
  usr_email AS email,
  usr_password AS password,
  usr_creado_en AS creado_en
`;

export class UserRepository {
  /** Busca un usuario por su correo electrónico. */
  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      `SELECT ${CAMPOS_USUARIO} FROM usr_usuarios WHERE usr_email = $1`,
      [email],
    );
    return result.rows[0] ?? null;
  }

  /** Busca un usuario por su identificador. */
  async findById(id: number): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      `SELECT ${CAMPOS_USUARIO} FROM usr_usuarios WHERE usr_id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  /** Crea un nuevo usuario y lo devuelve con su identificador asignado. */
  async create(nombre: string, email: string, passwordHash: string): Promise<Usuario> {
    const result = await pool.query<Usuario>(
      `INSERT INTO usr_usuarios (usr_nombre, usr_email, usr_password)
       VALUES ($1, $2, $3)
       RETURNING ${CAMPOS_USUARIO}`,
      [nombre, email, passwordHash],
    );
    return result.rows[0];
  }
}
