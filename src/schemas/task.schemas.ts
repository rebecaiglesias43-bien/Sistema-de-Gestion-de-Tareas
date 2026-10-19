import { JSONSchemaType } from 'ajv';
import { CrearTareaInput, ActualizarTareaInput, EstadoTarea } from '../types';

// Deben coincidir con el CHECK de tar_tareas.
const estados: EstadoTarea[] = ['pendiente', 'en curso', 'completada'];

/** Body de POST /tasks. */
export const createTaskSchema: JSONSchemaType<CrearTareaInput> = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 255 },
    descripcion: { type: 'string', nullable: true },
    fecha_vencimiento: { type: 'string', format: 'date', nullable: true },
    estado: { type: 'string', enum: estados, nullable: true },
  },
  required: ['titulo'],
  additionalProperties: false,
};

/** Body de PUT /tasks. Todo opcional: solo se cambia lo que llegue. */
export const updateTaskSchema: JSONSchemaType<ActualizarTareaInput> = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    descripcion: { type: 'string', nullable: true },
    fecha_vencimiento: { type: 'string', format: 'date', nullable: true },
    estado: { type: 'string', enum: estados, nullable: true },
  },
  additionalProperties: false,
};

/** El id de la ruta tiene que ser numérico. */
export const idParamsSchema: JSONSchemaType<{ id: string }> = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[0-9]+$' },
  },
  required: ['id'],
  additionalProperties: false,
};
