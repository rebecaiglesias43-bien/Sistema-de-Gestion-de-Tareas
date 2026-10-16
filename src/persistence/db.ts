import { Pool } from 'pg';
import { config } from '../config/env';

/**
 * Pool de conexiones a PostgreSQL.
 *
 * Se crea una única vez (módulo) y es reutilizado por todos los repositorios,
 * evitando abrir una conexión nueva por cada petición.
 */
export const pool = new Pool({
  connectionString: config.urlBaseDatos,
});

/**
 * Garantiza que las tablas necesarias existan en la base de datos.
 *
 * Se ejecuta una sola vez al arrancar la aplicación y usa sentencias
 * idempotentes (`IF NOT EXISTS`) para no duplicar estructura.
 */
export async function inicializarBaseDatos(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tareas (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      fecha_vencimiento DATE,
      estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'en curso', 'completada')),
      creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}
