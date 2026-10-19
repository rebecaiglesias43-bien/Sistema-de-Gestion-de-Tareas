import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/async-handler';
import { CrearTareaInput, ActualizarTareaInput } from '../types';

/**
 * Entrada HTTP de tareas.
 * El id del usuario siempre sale de req.user, nunca del body.
 */
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** POST /tasks */
  crear = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CrearTareaInput;
    const tarea = await this.taskService.crear(req.user!.id, data);
    res.status(201).json({ tarea });
  });

  /** GET /tasks */
  listar = asyncHandler(async (req: Request, res: Response) => {
    const tareas = await this.taskService.listar(req.user!.id);
    res.json({ tareas });
  });

  /** GET /tasks/:id */
  obtener = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const tarea = await this.taskService.obtener(id, req.user!.id);
    res.json({ tarea });
  });

  /** PUT /tasks/:id */
  actualizar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const data = req.body as ActualizarTareaInput;
    const tarea = await this.taskService.actualizar(id, req.user!.id, data);
    res.json({ tarea });
  });

  /** DELETE /tasks/:id */
  eliminar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    await this.taskService.eliminar(id, req.user!.id);
    res.status(204).send();
  });
}
