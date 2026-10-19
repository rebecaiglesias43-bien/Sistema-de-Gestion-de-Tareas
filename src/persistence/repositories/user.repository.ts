import { pool } from '../db';
import { Usuario } from '../../types';

/**
 * Acceso a usr_usuarios.
 * Los alias dejan los nombres que espera la API (id, nombre, email...).
 */
const CAMPOS_USUARIO = `
  usr_id AS id,
  usr_nombre AS nombre,
  usr_email AS email,
  usr_password AS password,
  usr_creado_en AS creado_en
`;

export class UserRepository {
  /** Busca por correo; el email es único. */
  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      `SELECT ${CAMPOS_USUARIO} FROM usr_usuarios WHERE usr_email = $1`,
      [email],
    );
    return result.rows[0] ?? null;
  }

  /** Busca por id. */
  async findById(id: number): Promise<Usuario | null> {
    const result = await pool.query<Usuario>(
      `SELECT ${CAMPOS_USUARIO} FROM usr_usuarios WHERE usr_id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  /** Inserta y devuelve el usuario con su id. */
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
