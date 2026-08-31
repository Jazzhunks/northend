import type { MaybeRefSchemaObject, SchemaObject } from './schemas/v3.1/strict/schema.js';
type ResolvedSchema<T> = T extends undefined ? undefined : SchemaObject & {
    $ref?: string;
};
export declare const resolve: {
    schema: <T extends MaybeRefSchemaObject | undefined>(schema: T) => ResolvedSchema<T>;
};
export {};
//# sourceMappingURL=resolve.d.ts.map