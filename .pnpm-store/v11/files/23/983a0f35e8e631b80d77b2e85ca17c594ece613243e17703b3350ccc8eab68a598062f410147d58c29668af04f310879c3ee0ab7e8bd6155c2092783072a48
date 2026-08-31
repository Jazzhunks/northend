import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { SecurityScheme } from '@scalar/types/entities';
import { type Static } from '@scalar/validation';
export declare const registryApiMetadata: import("@scalar/validation").ObjectSchema<{
    id: import("@scalar/validation").StringSchema;
    title: import("@scalar/validation").StringSchema;
    namespace: import("@scalar/validation").StringSchema;
    currentVersion: import("@scalar/validation").StringSchema;
    logoUrl: import("@scalar/validation").UnionSchema<readonly [import("@scalar/validation").StringSchema, import("@scalar/validation").NullableSchema]>;
    slug: import("@scalar/validation").StringSchema;
}>;
export type ApiMetadata = Static<typeof registryApiMetadata> & {
    removable?: boolean;
    searchEnabled?: boolean;
};
export type RegistryDocument = {
    namespace: string;
    slug: string;
};
export type DocumentSettings = Record<string, {
    securitySchemes: SecurityScheme[];
    activeServer: OpenAPIV3_1.ServerObject | undefined;
}>;
//# sourceMappingURL=document.d.ts.map