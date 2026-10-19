# Bitácora de Desarrollo

Este documento registra el proceso de desarrollo del **Sistema de Gestión de
Tareas**, incluyendo las decisiones tomadas, los problemas encontrados y el uso
de asistentes de inteligencia artificial.

## Uso de Asistentes de IA

> **Nota para el evaluador:** durante el desarrollo se utilizó un asistente de
> IA (opencode) como herramienta de apoyo. A continuación se documenta de forma
> transparente qué se solicitó, qué se aceptó, qué se rechazó y cómo se verificó.

### Contexto

El proyecto partió de un *scaffold* mínimo (un `src/index.ts` con un servidor
Express básico, `package.json`, `tsconfig.json` y un `.env`). Usé la IA como
apoyo puntual para revisar ese punto de partida y corregir detalles concretos,
pero la arquitectura en capas y las decisiones centrales las fui tomando yo
conforme avanzaba el desarrollo.

### 1. Revisión inicial del scaffold

**Prompt utilizado**

> "lee y analiza completamente el siguiente archivo [prueba técnica]. Esto es lo
> que tengo construido hasta ahora, necesito que corrijas lo que tú veas que esté
> mal."

**Qué se aceptó y por qué**

- El diagnóstico fue correcto: el `src/index.ts` no cargaba `dotenv`, leía
  `process.env.PORT` cuando el `.env` definía `PUERTO` (mismatch), el
  `.env.example` estaba vacío y no existía `.gitignore`. Aceptar estas
  correcciones era correcto porque evitaban un fallo real en tiempo de
  ejecución y una posible fuga de credenciales en el repositorio.

**Qué se rechazó o modificó**

- No se aceptó subir el `.env` con credenciales reales; se añadió un
  `.gitignore` para excluirlo. Se mantuvo la nomenclatura en español de las
  variables (`PUERTO`, `URL_BASE_DATOS`, `SECRETO_JWT`, `EXPIRACION_JWT`) para
  no romper la coherencia con lo ya iniciado.

**Verificación realizada**

- Se comprobó que `tsc` compilara sin errores y que el servidor levantara
  correctamente leyendo las variables desde `.env`.

### 2. Construcción de la API por capas

**Prompt utilizado**

> "Corrige los errores y construye toda la API" (autenticación con bcrypt y JWT,
> CRUD de tareas, validación con AJV, manejo de errores centralizado, Swagger,
> estructura en capas).

**Qué se aceptó y por qué**

- La **estructura en capas** (`api`, `controllers`, `services`, `persistence`),
  porque coincide con lo exigido por la prueba y mejora la mantenibilidad.
- El **patrón Singleton** para la configuración, pedido explícitamente en la
  prueba.
- El uso de **repositorios** para aislar el SQL, lo que facilita probar y
  cambiar de base de datos sin tocar la lógica de negocio.
- El hasheo de contraseñas con **bcrypt** y la emisión de **JWT**, requerimientos
  obligatorios.

**Qué se rechazó o modificó**

- En el `UPDATE` de tareas, la versión inicial usaba `COALESCE(campo, valor)`,
  lo que impedía establecer explícitamente un campo a `NULL` (por ejemplo,
  limpiar la descripción). Se rechazó ese enfoque y se sustituyó por una
  construcción dinámica del `SET` que distingue "campo no enviado" de "campo
  enviado como null". Motivo: tipado/semántica incorrecta para una actualización
  parcial.
- El tipo de `expiresIn` de JWT no era compatible con el `string` genérico que
  devolvía la configuración; se corrigió con un cast explícito a
  `jwt.SignOptions['expiresIn']`. Motivo: tipado incorrecto que impedía
  compilar.

**Verificación realizada**

- Compilación con `tsc --noEmit` sin errores.
- Pruebas de integración manuales contra PostgreSQL real, cubriendo:
  registro, login, CRUD completo, validación (400), autenticación (401),
  conflicto de email (409), rutas inexistentes (404) y **aislamiento de datos
  entre usuarios** (un usuario no puede leer ni eliminar tareas de otro).

### 3. Configuración de Swagger

**Prompt utilizado**

> "Configura Swagger y documenta todos los endpoints".

**Qué se aceptó y por qué**

- Se usó `swagger-jsdoc` + `swagger-ui-express`, que permite mantener la
  documentación junto a las rutas mediante anotaciones, reduciendo el riesgo de
  que la documentación quede desactualizada.

**Qué se rechazó o modificó**

- Se definió un único `securityScheme` `bearerAuth` reutilizable en lugar de
  duplicar la configuración de seguridad en cada endpoint.

**Verificación realizada**

- Se confirmó que la interfaz de Swagger UI quedara disponible en `/api-docs`.

### 4. Actualización parcial de tareas (SQL dinámico)

**Prompt utilizado**

> "En `TaskRepository`, el método `update` debe modificar únicamente los campos que
> lleguen en el body (`titulo`, `descripcion`, `fecha_vencimiento`, `estado`).
> Necesito que `descripcion` o `fecha_vencimiento` se puedan dejar en `NULL`
> explícitamente (limpiar el campo), así que no uses `COALESCE` en el `SET`.
> Construye la cláusula `SET` de forma dinámica con parámetros posicionales,
> reservando `$1` y `$2` para el id y el `usuario_id` del `WHERE`, y devuelve la
> fila actualizada con `RETURNING`. Mantén el filtro por `tar_usuario_id` para que
> un usuario no pueda modificar tareas ajenas."

**Qué se aceptó y por qué**

- El arreglo `valores` que arranca con `[id, usuarioId]` y empuja cada campo
  presente, calculando el placeholder con `valores.length`. Es correcto porque
  garantiza que los índices del `SET` nunca se desincronicen con los `$1`/`$2`
  del `WHERE`, sin importar cuántos campos lleguen en la petición.
- Añadir `tar_actualizado_en = NOW()` como última asignación, para preservar la
  semántica de "fecha de última modificación".

**Qué se rechazó o modificó**

- Se descartó interpolar los valores directamente en la cadena SQL (concatenación),
  porque exponía el endpoint a inyección SQL; se mantuvo el uso de parámetros `$n`.
- Se confirmó el rechazo del enfoque `COALESCE(campo, valor)` (mencionado en el
  apartado anterior): impide escribir `NULL` y confunde "campo no enviado" con
  "campo enviado como null".

**Verificación realizada**

- Pruebas manuales contra PostgreSQL: actualizar solo `estado`, actualizar solo
  `titulo` y enviar `{ "descripcion": null }` para confirmar que el campo queda en
  `NULL`. Se comprobó además que un `UPDATE` sobre un id de otro usuario devuelve
  cero filas y el servicio lanza `NotFoundError`.

### Decisiones tomadas sin asistencia de IA

1. **PostgreSQL y la integridad en la base de datos.** Elegí PostgreSQL porque
   ya lo tenía configurado, y aproveché `FOREIGN KEY ... ON DELETE CASCADE` y el
   `CHECK` de `tar_estado` en lugar de validarlo todo solo en el código.

2. **Convención de nombres con prefijo por entidad** (`usr_*`, `tar_*`). La
   mantuve para que cada columna deje claro a qué tabla pertenece, tanto en los
   repositorios como en el script `gestion_tareas.sql`.

## Retos y Soluciones

- `bcrypt` mostraba advertencias de *install scripts* en Node 24: comprobé que la
  biblioteca funcionaba correctamente (incluye *prebuilds*), sin compilación adicional.
- Incompatibilidad de tipos en `expiresIn` de `jsonwebtoken`: lo ajusté con
  `jwt.SignOptions['expiresIn']`.
- Actualización parcial que no permitía limpiar campos (`COALESCE`): construí
  dinámicamente la cláusula `SET` en el repositorio.
- Aislamiento de datos entre usuarios: todas las consultas de tareas filtran por
  `usuario_id`; el servicio lanza 404 si el recurso no pertenece al usuario.
