import { Pool } from 'pg';
import { config } from '../config/env';

/**
 * Pool compartido por todos los repositorios.
 * Se crea al importar el módulo, no en cada petición.
 */
export const pool = new Pool({
  connectionString: config.urlBaseDatos,
});

/**
 * Deja las tablas listas al arrancar.
 * Los IF NOT EXISTS permiten ejecutarlo varias veces sin romper nada.
 */
export async function inicializarBaseDatos(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usr_usuarios (
      usr_id SERIAL PRIMARY KEY,
      usr_nombre VARCHAR(100) NOT NULL,
      usr_email VARCHAR(255) UNIQUE NOT NULL,
      usr_password VARCHAR(255) NOT NULL,
      usr_creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tar_tareas (
      tar_id SERIAL PRIMARY KEY,
      tar_usuario_id INTEGER NOT NULL REFERENCES usr_usuarios(usr_id) ON DELETE CASCADE,
      tar_titulo VARCHAR(255) NOT NULL,
      tar_descripcion TEXT,
      tar_fecha_vencimiento DATE,
      tar_estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (tar_estado IN ('pendiente', 'en curso', 'completada')),
      tar_creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      tar_actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}
