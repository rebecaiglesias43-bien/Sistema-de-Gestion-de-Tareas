# Bitácora de Desarrollo

Este documento registra el proceso de desarrollo del **Sistema de Gestión de
Tareas**, incluyendo las decisiones tomadas, los problemas encontrados y el uso
de asistentes de inteligencia artificial.

---

## Uso de Asistentes de IA

> **Nota para el evaluador:** durante el desarrollo se utilizó un asistente de
> IA (opencode) como herramienta de apoyo. A continuación se documenta de forma
> transparente qué se solicitó, qué se aceptó, qué se rechazó y cómo se verificó.

### Contexto

El proyecto partió de un *scaffold* mínimo (un `src/index.ts` con un servidor
Express básico, `package.json`, `tsconfig.json` y un `.env`). Se usó IA para
revisar el estado inicial y construir la funcionalidad completa.

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

---

### Decisiones tomadas sin asistencia de IA

> **TODO:** completar esta sección con al menos dos decisiones que hayas tomado
> de forma independiente. A continuación se sugieren ejemplos que puedes
> validar/adoptar según tu propio razonamiento:

1. **Elección de PostgreSQL como base de datos.** Decidí usar PostgreSQL (ya
   incluido en las dependencias iniciales) por encima de MongoDB, priorizando
   la integridad referencial (`FOREIGN KEY ... ON DELETE CASCADE`) para la
   relación usuario-tareas.

2. **Estructura de las respuestas JSON.** Decidí envolver siempre los resultados
   en objetos (`{ "usuario": ... }`, `{ "tarea": ... }`, `{ "tareas": [...] }`)
   y usar una forma de error consistente (`{ "error": { "mensaje": ... } }`),
   para que los clientes tengan un contrato predecible.

*(Reemplaza estos ejemplos por tus decisiones reales y explica tu razonamiento.)*

---

## Retos y Soluciones

| Reto | Solución |
| ---- | -------- |
| `bcrypt` mostraba advertencias de *install scripts* en Node 24 | Se comprobó que la biblioteca funcionaba correctamente (incluye *prebuilds*), por lo que no se requirió compilación adicional. |
| Incompatibilidad de tipos en `expiresIn` de `jsonwebtoken` | Se ajustó el tipo con `jwt.SignOptions['expiresIn']`. |
| Actualización parcial que no permitía limpiar campos (`COALESCE`) | Se construyó dinámicamente la cláusula `SET` en el repositorio. |
| Aislamiento de datos entre usuarios | Todas las consultas de tareas filtran por `usuario_id`; el servicio lanza 404 si el recurso no pertenece al usuario. |
