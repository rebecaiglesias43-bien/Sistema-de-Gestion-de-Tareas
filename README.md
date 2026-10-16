# Sistema de Gestión de Tareas

API RESTful para registro de usuarios, autenticación y gestión de tareas
personales, desarrollada con **Node.js + Express + TypeScript** y **PostgreSQL**.

## Descripción

La aplicación permite a los usuarios:

- Registrarse e iniciar sesión (contraseñas hasheadas con bcrypt y tokens JWT).
- Crear, listar, consultar, actualizar y eliminar sus propias tareas.
- Cada tarea está asociada al usuario que la creó, por lo que ningún usuario
  puede acceder a las tareas de otro.

## Arquitectura

El proyecto sigue una **arquitectura en capas** que separa responsabilidades:

```
src/
├── api/
│   ├── middlewares/     # Autenticación, validación y manejo de errores
│   └── routes/          # Definición de rutas y documentación Swagger
├── config/              # Singleton de variables de entorno (.env)
├── controllers/         # Traduce peticiones HTTP a llamadas a servicios
├── docs/                # Configuración de Swagger
├── errors/              # Clases de error personalizadas
├── persistence/         # Conexión a BD y repositorios (SQL)
├── schemas/             # Esquemas de validación (AJV/JSONSchema)
├── services/            # Lógica de negocio
├── types/               # Tipos e interfaces de dominio
└── utils/               # Utilidades (wrapper de controladores async)
```

Flujo de una petición: `route → middleware → controller → service → repository → PostgreSQL`.

### Patrones de diseño utilizados

- **Singleton**: la configuración (`src/config/env.ts`) carga las variables de
  entorno una única vez.
- **Repositorios**: aíslan el acceso a datos (SQL) del resto de la aplicación.
- **Errores personalizados**: `AppError` y subclases (`NotFoundError`,
  `AuthenticationError`, `ConflictError`, `ValidationError`) manejadas por un
  middleware centralizado.

## Requisitos previos

- Node.js 18 o superior.
- PostgreSQL en ejecución (base de datos `gestion_tareas` creada).

## Instalación local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd "Sistema de Gestion de Tareas"

# 2. Instalar dependencias
npm install
```

## Configuración del archivo `.env`

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

Variables disponibles:

| Variable          | Descripción                                        | Ejemplo                                                        |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `PUERTO`          | Puerto HTTP del servidor                           | `3000`                                                         |
| `URL_BASE_DATOS`  | Cadena de conexión a PostgreSQL                    | `postgresql://usuario:pass@localhost:5432/gestion_tareas`      |
| `SECRETO_JWT`     | Secreto para firmar los tokens JWT                 | un valor largo y aleatorio                                     |
| `EXPIRACION_JWT`  | Tiempo de expiración del token                     | `1h`                                                           |

> Las tablas se crean automáticamente al iniciar la aplicación
> (`CREATE TABLE IF NOT EXISTS` en `src/persistence/db.ts`).

## Ejecutar el proyecto

```bash
# Modo desarrollo (reinicio automático con ts-node-dev)
npm run dev

# Compilar a JavaScript (genera ./dist)
npm run build

# Ejecutar la versión compilada
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## Documentación de la API (Swagger)

Con el servidor en ejecución, abre: <http://localhost:3000/api-docs>

## Endpoints

### Autenticación

| Método | Ruta              | Descripción                    | Auth |
| ------ | ----------------- | ------------------------------ | ---- |
| POST   | `/auth/register`  | Registra un nuevo usuario      | No   |
| POST   | `/auth/login`     | Inicia sesión y devuelve JWT   | No   |

### Tareas (requieren token JWT)

| Método | Ruta          | Descripción                              | Auth |
| ------ | ------------- | ---------------------------------------- | ---- |
| POST   | `/tasks`      | Crea una tarea                           | Sí   |
| GET    | `/tasks`      | Lista las tareas del usuario             | Sí   |
| GET    | `/tasks/:id`  | Obtiene una tarea del usuario            | Sí   |
| PUT    | `/tasks/:id`  | Actualiza una tarea del usuario          | Sí   |
| DELETE | `/tasks/:id`  | Elimina una tarea del usuario            | Sí   |

Los endpoints protegidos requieren la cabecera:

```
Authorization: Bearer <token>
```

## Scripts

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Ejecuta en modo desarrollo           |
| `npm run build` | Compila TypeScript a `./dist`        |
| `npm start`     | Ejecuta la versión compilada         |
