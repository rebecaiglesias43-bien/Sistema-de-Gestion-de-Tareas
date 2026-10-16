import { pool } from '../db';
import { Tarea, CrearTareaInput, ActualizarTareaInput, EstadoTarea } from '../../types';

/** Fila devuelta por la base de datos para una tarea. */
interface TareaFila {
  id: number;
  usuario_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: string | null;
  estado: EstadoTarea;
  creado_en: Date;
  actualizado_en: Date;
}

const CAMPOS_TAREA = `
  id,
  usuario_id,
  titulo,
  descripcion,
  fecha_vencimiento::text AS fecha_vencimiento,
  estado,
  creado_en,
  actualizado_en
`;

/**
 * Repositorio encargado de la comunicación con la tabla `tareas`.
 *
 * Todas las consultas filtran por `usuario_id` para garantizar que un usuario
 * únicamente pueda leer o modificar sus propias tareas.
 */
export class TaskRepository {
  /** Crea una tarea para un usuario y la devuelve con su identificador. */
  async create(usuarioId: number, data: CrearTareaInput): Promise<Tarea> {
    const result = await pool.query<TareaFila>(
      `INSERT INTO tareas (usuario_id, titulo, descripcion, fecha_vencimiento, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${CAMPOS_TAREA}`,
      [
        usuarioId,
        data.titulo,
        data.descripcion ?? null,
        data.fecha_vencimiento ?? null,
        data.estado ?? 'pendiente',
      ],
    );
    return result.rows[0];
  }

  /** Devuelve todas las tareas que pertenecen a un usuario. */
  async findByUser(usuarioId: number): Promise<Tarea[]> {
    const result = await pool.query<TareaFila>(
      `SELECT ${CAMPOS_TAREA} FROM tareas WHERE usuario_id = $1 ORDER BY creado_en DESC`,
      [usuarioId],
    );
    return result.rows;
  }

  /** Busca una tarea específica verificando que pertenezca al usuario. */
  async findByIdAndUser(id: number, usuarioId: number): Promise<Tarea | null> {
    const result = await pool.query<TareaFila>(
      `SELECT ${CAMPOS_TAREA} FROM tareas WHERE id = $1 AND usuario_id = $2`,
      [id, usuarioId],
    );
    return result.rows[0] ?? null;
  }

  /** Actualiza únicamente los campos proporcionados de una tarea del usuario. */
  async update(id: number, usuarioId: number, data: ActualizarTareaInput): Promise<Tarea | null> {
    const asignaciones: string[] = [];
    const valores: unknown[] = [id, usuarioId];

    if (data.titulo !== undefined) {
      valores.push(data.titulo);
      asignaciones.push(`titulo = $${valores.length}`);
    }
    if (data.descripcion !== undefined) {
      valores.push(data.descripcion);
      asignaciones.push(`descripcion = $${valores.length}`);
    }
    if (data.fecha_vencimiento !== undefined) {
      valores.push(data.fecha_vencimiento);
      asignaciones.push(`fecha_vencimiento = $${valores.length}`);
    }
    if (data.estado !== undefined) {
      valores.push(data.estado);
      asignaciones.push(`estado = $${valores.length}`);
    }

    asignaciones.push('actualizado_en = NOW()');

    const result = await pool.query<TareaFila>(
      `UPDATE tareas SET ${asignaciones.join(', ')}
       WHERE id = $1 AND usuario_id = $2
       RETURNING ${CAMPOS_TAREA}`,
      valores,
    );
    return result.rows[0] ?? null;
  }

  /** Elimina una tarea del usuario y devuelve si se eliminó alguna fila. */
  async delete(id: number, usuarioId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM tareas WHERE id = $1 AND usuario_id = $2',
      [id, usuarioId],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
