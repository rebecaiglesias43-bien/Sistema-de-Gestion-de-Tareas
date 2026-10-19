/** Estados válidos de una tarea (los mismos del CHECK). */
export type EstadoTarea = 'pendiente' | 'en curso' | 'completada';

/** Usuario tal como vive en la base. */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  creado_en: Date;
}

/** Usuario sin el hash, para las respuestas. */
export type UsuarioPublico = Omit<Usuario, 'password'>;

/** Tarea tal como la devuelve la API. */
export interface Tarea {
  id: number;
  usuario_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: string | null;
  estado: EstadoTarea;
  creado_en: Date;
  actualizado_en: Date;
}

/** Datos para crear una tarea. */
export interface CrearTareaInput {
  titulo: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: EstadoTarea;
}

/** Campos que se pueden cambiar en un PUT. */
export interface ActualizarTareaInput {
  titulo?: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: EstadoTarea;
}

/** Lo que guardamos dentro del JWT. */
export interface JwtPayload {
  id: number;
  email: string;
}
