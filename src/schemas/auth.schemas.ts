import { JSONSchemaType } from 'ajv';

export interface RegistroInput {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Esquema de validación para el registro de un usuario. */
export const registerSchema: JSONSchemaType<RegistroInput> = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['nombre', 'email', 'password'],
  additionalProperties: false,
};

/** Esquema de validación para el inicio de sesión. */
export const loginSchema: JSONSchemaType<LoginInput> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
