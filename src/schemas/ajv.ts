import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

// allErrors: devuelve todos los fallos, no solo el primero.
const ajv = new Ajv({ allErrors: true });
// Formatos estándar: email, date, etc.
addFormats(ajv);

export { ajv };
export type { JSONSchemaType };
