import { pool } from '../db';
import { Usuario } from '../../types';

/**
 * Repositorio encargado de la comunicación con la tabla `usuarios`.
 *
 * Aísla las consultas SQL del resto de la aplicación para que los servicios
 * dependan de métodos con intención clara en lugar de sentencias crudas.
 */
export class UserRepository {
  /** Busca un usuario por su correo electrónico. */
  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      'SELECT id, nombre, email, password, creado_en FROM usuarios WHERE email = $1',
      [email],
    );
    return result.rows[0] ?? null;
  }

  /** Busca un usuario por su identificador. */
  async findById(id: number): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      'SELECT id, nombre, email, password, creado_en FROM usuarios WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  }

  /** Crea un nuevo usuario y lo devuelve con su identificador asignado. */
  async create(nombre: string, email: string, passwordHash: string): Promise<Usuario> {
    const result = await pool.query<Usuario>(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, email, password, creado_en`,
      [nombre, email, passwordHash],
    );
    return result.rows[0];
  }
}
