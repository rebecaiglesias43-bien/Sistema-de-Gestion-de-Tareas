import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { inicializarBaseDatos } from './persistence/db';
import { apiRoutes } from './api/routes';
import { notFoundHandler } from './api/middlewares/not-found.middleware';
import { errorHandler } from './api/middlewares/error.middleware';
import { setupSwagger } from './docs/swagger';

/**
 * Arranque de la API: prepara la base, monta middlewares y rutas,
 * y deja el servidor escuchando en el puerto configurado.
 */
async function main(): Promise<void> {
  await inicializarBaseDatos();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ mensaje: 'Sistema de Gestión de Tareas', docs: '/api-docs' });
  });

  setupSwagger(app);

  app.use(apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(config.puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${config.puerto}`);
  });
}

main().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
