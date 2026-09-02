import type { SchemaObject } from '../../../schemas/v3.1/strict/openapi-document.js';
import type { ParameterObject, ParameterWithContentObject } from '../../../schemas/v3.1/strict/parameter.js';
export declare const isObjectSchema: (schema: SchemaObject) => schema is Extract<SchemaObject, {
    type: "object";
}>;
export declare const isArraySchema: (schema: SchemaObject) => schema is Extract<SchemaObject, {
    type: "array";
}>;
export declare const isStringSchema: (schema: SchemaObject) => schema is Extract<SchemaObject, {
    type: "string";
}>;
export declare const isNumberSchema: (schema: SchemaObject) => schema is Extract<SchemaObject, {
    type: "number" | "integer";
}>;
/** Special type guard to remove our internal type */
export declare const isSchema: (schema: SchemaObject | undefined) => schema is Exclude<SchemaObject, {
    __scalar_: string;
}>;
/**
 * Type guard to check if the given parameter is a ParameterWithContentObject,
 * i.e., it has a 'content' property defined.
 */
export declare const isContentTypeParameterObject: (parameter: ParameterObject) => parameter is ParameterWithContentObject;
//# sourceMappingURL=type-guards.d.ts.map