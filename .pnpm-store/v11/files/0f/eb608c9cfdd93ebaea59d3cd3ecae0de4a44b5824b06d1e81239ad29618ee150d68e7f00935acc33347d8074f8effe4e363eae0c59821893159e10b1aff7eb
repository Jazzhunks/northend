import type { SecurityScheme } from '@scalar/types/entities';
import type { AuthStore } from '@scalar/workspace-store/entities/auth';
import type { DeepPartial } from '@scalar/workspace-store/helpers/overrides-proxy';
import type { SecuritySchemeObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { SecuritySchemeObjectSecret } from '../../../request-example/builder/security/secret-types.js';
/** A combined scheme that includes both the auth store secrets and a deep partial of the config auth */
export type ConfigAuthScheme = SecuritySchemeObject & DeepPartial<SecurityScheme>;
/** Extract the secrets from the config and the auth store */
export declare const extractSecuritySchemeSecrets: (scheme: SecuritySchemeObject & DeepPartial<SecurityScheme>, authStore: AuthStore, name: string, documentSlug: string, oauth2RedirectUri?: string) => SecuritySchemeObjectSecret;
//# sourceMappingURL=extract-security-scheme-secrets.d.ts.map