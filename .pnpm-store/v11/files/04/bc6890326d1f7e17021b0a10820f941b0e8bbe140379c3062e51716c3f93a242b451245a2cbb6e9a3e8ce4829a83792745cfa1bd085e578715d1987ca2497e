/**
 * Returns true when an OpenAPI entity (tag, operation, schema, …) is marked as hidden
 * from navigation via `x-internal` or `x-scalar-ignore`.
 */
export const isHidden = (entity) => Boolean(entity?.['x-internal'] || entity?.['x-scalar-ignore']);
