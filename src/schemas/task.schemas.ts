import { JSONSchemaType } from 'ajv';
import { CrearTareaInput, ActualizarTareaInput, EstadoTarea } from '../types';

const estados: EstadoTarea[] = ['pendiente', 'en curso', 'completada'];

/** Esquema de validación para la creación de una tarea. */
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

/** Esquema de validación para la actualización (parcial) de una tarea. */
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

/** Esquema para validar parámetros de ruta con un identificador numérico. */
export const idParamsSchema: JSONSchemaType<{ id: string }> = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[0-9]+$' },
  },
  required: ['id'],
  additionalProperties: false,
};
