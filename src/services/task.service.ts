import { TaskRepository } from '../persistence/repositories/task.repository';
import { Tarea, CrearTareaInput, ActualizarTareaInput } from '../types';
import { NotFoundError } from '../errors';

/**
 * Reglas de las tareas.
 * Todo pasa por el repositorio con el id del usuario, así que desde aquí
 * no hay forma de tocar tareas ajenas.
 */
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  /** Crea una tarea para el usuario. */
  async crear(usuarioId: number, data: CrearTareaInput): Promise<Tarea> {
    return this.taskRepository.create(usuarioId, data);
  }

  /** Lista solo las tareas del usuario. */
  async listar(usuarioId: number): Promise<Tarea[]> {
    return this.taskRepository.findByUser(usuarioId);
  }

  /** Busca una tarea; si no existe o es de otro, 404. */
  async obtener(id: number, usuarioId: number): Promise<Tarea> {
    const tarea = await this.taskRepository.findByIdAndUser(id, usuarioId);
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }
    return tarea;
  }

  /** Actualiza y devuelve la tarea; si no es del usuario, 404. */
  async actualizar(id: number, usuarioId: number, data: ActualizarTareaInput): Promise<Tarea> {
    const tarea = await this.taskRepository.update(id, usuarioId, data);
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }
    return tarea;
  }

  /** Borra la tarea; si no existía o no era suya, 404. */
  async eliminar(id: number, usuarioId: number): Promise<void> {
    const eliminada = await this.taskRepository.delete(id, usuarioId);
    if (!eliminada) {
      throw new NotFoundError('Tarea no encontrada');
    }
  }
}
