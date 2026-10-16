import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/async-handler';
import { CrearTareaInput, ActualizarTareaInput } from '../types';

/**
 * Controlador de tareas.
 *
 * Todas las acciones usan `req.user` (inyectado por el middleware de
 * autenticación) para operar únicamente sobre las tareas del usuario.
 */
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** Maneja `POST /tasks`. */
  crear = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CrearTareaInput;
    const tarea = await this.taskService.crear(req.user!.id, data);
    res.status(201).json({ tarea });
  });

  /** Maneja `GET /tasks`. */
  listar = asyncHandler(async (req: Request, res: Response) => {
    const tareas = await this.taskService.listar(req.user!.id);
    res.json({ tareas });
  });

  /** Maneja `GET /tasks/:id`. */
  obtener = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const tarea = await this.taskService.obtener(id, req.user!.id);
    res.json({ tarea });
  });

  /** Maneja `PUT /tasks/:id`. */
  actualizar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const data = req.body as ActualizarTareaInput;
    const tarea = await this.taskService.actualizar(id, req.user!.id, data);
    res.json({ tarea });
  });

  /** Maneja `DELETE /tasks/:id`. */
  eliminar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    await this.taskService.eliminar(id, req.user!.id);
    res.status(204).send();
  });
}
