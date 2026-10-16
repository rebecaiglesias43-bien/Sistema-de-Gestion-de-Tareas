import { TaskRepository } from '../persistence/repositories/task.repository';
import { Tarea, CrearTareaInput, ActualizarTareaInput } from '../types';
import { NotFoundError } from '../errors';

/**
 * Servicio de tareas.
 *
 * Encapsula las reglas de negocio asociadas al CRUD de tareas, garantizando
 * que todas las operaciones estén limitadas al usuario propietario.
 */
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  /** Crea una tarea para el usuario indicado. */
  async crear(usuarioId: number, data: CrearTareaInput): Promise<Tarea> {
    return this.taskRepository.create(usuarioId, data);
  }

  /** Lista todas las tareas del usuario. */
  async listar(usuarioId: number): Promise<Tarea[]> {
    return this.taskRepository.findByUser(usuarioId);
  }

  /** Obtiene una tarea del usuario o lanza 404 si no existe o no le pertenece. */
  async obtener(id: number, usuarioId: number): Promise<Tarea> {
    const tarea = await this.taskRepository.findByIdAndUser(id, usuarioId);
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }
    return tarea;
  }

  /** Actualiza una tarea del usuario o lanza 404 si no existe o no le pertenece. */
  async actualizar(id: number, usuarioId: number, data: ActualizarTareaInput): Promise<Tarea> {
    const tarea = await this.taskRepository.update(id, usuarioId, data);
    if (!tarea) {
      throw new NotFoundError('Tarea no encontrada');
    }
    return tarea;
  }

  /** Elimina una tarea del usuario o lanza 404 si no existe o no le pertenece. */
  async eliminar(id: number, usuarioId: number): Promise<void> {
    const eliminada = await this.taskRepository.delete(id, usuarioId);
    if (!eliminada) {
      throw new NotFoundError('Tarea no encontrada');
    }
  }
}
