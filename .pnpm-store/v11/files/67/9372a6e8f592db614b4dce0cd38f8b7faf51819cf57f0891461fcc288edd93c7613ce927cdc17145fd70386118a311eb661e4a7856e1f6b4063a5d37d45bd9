export const isObjectSchema = (schema) => {
    return ('type' in schema && (schema.type === 'object' || (Array.isArray(schema.type) && schema.type.includes('object'))));
};
export const isArraySchema = (schema) => {
    return 'type' in schema && (schema.type === 'array' || (Array.isArray(schema.type) && schema.type.includes('array')));
};
export const isStringSchema = (schema) => {
    return ('type' in schema && (schema.type === 'string' || (Array.isArray(schema.type) && schema.type.includes('string'))));
};
export const isNumberSchema = (schema) => {
    return ('type' in schema &&
        (schema.type === 'number' ||
            schema.type === 'integer' ||
            (Array.isArray(schema.type) && schema.type.includes('number')) ||
            (Array.isArray(schema.type) && schema.type.includes('integer'))));
};
/** Special type guard to remove our internal type */
export const isSchema = (schema) => schema !== undefined && 'type' in schema;
/**
 * Type guard to check if the given parameter is a ParameterWithContentObject,
 * i.e., it has a 'content' property defined.
 */
export const isContentTypeParameterObject = (parameter) => {
    return 'content' in parameter && parameter.content !== undefined;
};
