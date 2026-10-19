# Sistema de Gestión de Tareas

API para gestionar tareas personales hecha con Node.js, Express y TypeScript,
usando PostgreSQL como base de datos.

## Qué hace

- Los usuarios se pueden registrar e iniciar sesión. La contraseña se guarda
  hasheada con bcrypt y el login devuelve un JWT.
- Una vez autenticado, cada usuario puede crear, listar, editar y borrar sus
  propias tareas. Cada tarea queda ligada a su creador, así que nadie puede ver
  o modificar tareas de otro usuario.
- Una tarea tiene: título, descripción, fecha de vencimiento y estado
  (`pendiente`, `en curso` o `completada`).

## Estructura

El código está separado por capas para que cada parte tenga una responsabilidad
clara:

```
src/
├── api/           Rutas y middlewares (auth, validación, errores)
├── config/        Variables de entorno (Singleton)
├── controllers/   Reciben la petición y responden
├── docs/          Configuración de Swagger
├── errors/        Clases de error propias
├── persistence/   Conexión a PostgreSQL y repositorios
├── schemas/       Validación con AJV/JSONSchema
├── services/      Lógica de negocio
├── types/         Tipos de dominio
└── utils/         Helpers
```

El flujo de una petición es: ruta → middleware → controller → service →
repository → base de datos.

## Requisitos

- Node.js 18 o superior.
- PostgreSQL corriendo con una base de datos llamada `gestion_tareas`.

## Instalación

```bash
git clone <url-del-repositorio>
cd "Sistema de Gestion de Tareas"
npm install
```

## Configurar el `.env`

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Y edítalo con tus datos. Las variables son:

- `PUERTO`: puerto del servidor (por defecto `3000`).
- `URL_BASE_DATOS`: cadena de conexión a PostgreSQL, por ejemplo
  `postgresql://usuario:contraseña@localhost:5432/gestion_tareas`.
- `SECRETO_JWT`: clave para firmar los tokens.
- `EXPIRACION_JWT`: cuánto dura el token (ej. `1h`).

Las tablas se crean solas al arrancar, no hace falta correr ningún script.

## Correr el proyecto

```bash
npm run dev      # modo desarrollo, se reinicia solo al guardar
npm run build    # compila a ./dist
npm start        # corre la versión compilada
```

El servidor queda en `http://localhost:3000`.

### Iniciar PostgreSQL en Windows (opcional)

Si usas una instalación local o portable de PostgreSQL y no corre como servicio
de Windows, puedes levantarlo con:

```bat
scripts\iniciar-bd.bat
```

El script busca PostgreSQL en la variable `PGSQL_HOME` y, si no está definida,
en `C:\Program Files\PostgreSQL\18` (y versiones anteriores). Para una
instalación portable, define la variable antes de ejecutarlo:

```bat
set PGSQL_HOME=%USERPROFILE%\Desktop\pgsql
scripts\iniciar-bd.bat
```

Si PostgreSQL ya está corriendo (por ejemplo, como servicio), el script no hace
nada. No es necesario en Linux ni macOS.

## Endpoints

- `POST /auth/register` — crea un usuario.
- `POST /auth/login` — devuelve el token.

Con el token en la cabecera `Authorization: Bearer <token>`:

- `POST /tasks` — crea una tarea.
- `GET /tasks` — lista tus tareas.
- `GET /tasks/:id` — una tarea.
- `PUT /tasks/:id` — edita una tarea.
- `DELETE /tasks/:id` — borra una tarea.

## Documentación

La documentación de Swagger está en `http://localhost:3000/api-docs` con el
servidor corriendo.
