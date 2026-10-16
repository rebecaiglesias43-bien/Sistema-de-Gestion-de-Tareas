/** Posibles estados en los que puede encontrarse una tarea. */
export type EstadoTarea = 'pendiente' | 'en curso' | 'completada';

/** Representa un usuario registrado en el sistema. */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  creado_en: Date;
}

/** Usuario listo para exponer en respuestas (sin el hash de la contraseña). */
export type UsuarioPublico = Omit<Usuario, 'password'>;

/** Representa una tarea asociada a un usuario. */
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

/** Datos necesarios para crear una tarea. */
export interface CrearTareaInput {
  titulo: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: EstadoTarea;
}

/** Datos opcionales para actualizar una tarea. */
export interface ActualizarTareaInput {
  titulo?: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: EstadoTarea;
}

/** Contenido del JSON Web Token una vez verificado. */
export interface JwtPayload {
  id: number;
  email: string;
}
