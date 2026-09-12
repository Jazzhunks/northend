import type { AuthenticationConfiguration } from '@scalar/types/api-reference';
import type { SelectedSecurity } from '@scalar/workspace-store/entities/auth';
import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
type DefaultScopeScheme = {
    type?: string;
    'x-default-scopes'?: string[];
};
/**
 * Resolves which security selection to use for an operation.
 *
 * Priority order:
 * 1. Operation-level selection (if set)
 * 2. Document-level selection (if set)
 * 3. Preferred security scheme from configuration (if provided)
 * 4. First security requirement from the OpenAPI spec
 * 5. No selection (if auth is optional or no requirements exist)
 */
export declare const getSelectedSecurity: (documentSelectedSecurity: SelectedSecurity | undefined, operationSelectedSecurity: SelectedSecurity | undefined, securityRequirements?: NonNullable<OpenApiDocument["security"]>, securitySchemes?: Record<string, DefaultScopeScheme | undefined>, preferredSecurityScheme?: AuthenticationConfiguration["preferredSecurityScheme"]) => SelectedSecurity;
export {};
//# sourceMappingURL=get-selected-security.d.ts.map