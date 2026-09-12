import { Type } from '@scalar/typebox';
import { getResolvedRef, mergeSiblingReferences } from './helpers/get-resolved-ref.js';
import { compose } from './schemas/compose.js';
import { coerceValue } from './schemas/typebox-coerce.js';
import { SchemaObjectSchema } from './schemas/v3.1/strict/openapi-document.js';
export const resolve = {
    schema: (schema) => {
        if (schema === undefined) {
            return undefined;
        }
        const resoled = getResolvedRef(schema, mergeSiblingReferences);
        return coerceValue(compose(SchemaObjectSchema, Type.Object({ $ref: Type.Optional(Type.String()) })), resoled);
    },
};
