import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const opciones: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Tareas',
      version: '1.0.0',
      description: 'API RESTful para registro de usuarios, autenticación y gestión de tareas personales.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['src/api/routes/*.ts', 'src/docs/*.ts'],
};

const especificacion = swaggerJSDoc(opciones);

/** Deja Swagger UI en /api-docs y la especificación en JSON. */
export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(especificacion));
}
