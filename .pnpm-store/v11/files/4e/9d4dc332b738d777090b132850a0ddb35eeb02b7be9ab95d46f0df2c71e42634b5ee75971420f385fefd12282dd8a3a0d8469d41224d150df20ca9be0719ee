import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/operation';
import type { SecuritySchemeObject } from '@scalar/workspace-store/schemas/v3.1/strict/security-scheme';
export type RequiredSecurityState = 'required' | 'optional' | 'none';
export type RequiredSecurityScheme = {
    /** Scheme key as declared in `components.securitySchemes`. */
    name: string;
    /** Resolved scheme object. `undefined` if the referenced scheme isn't defined on the document. */
    scheme: SecuritySchemeObject | undefined;
    /** Scopes required by the operation for this scheme (OAuth2 / OpenID Connect). Empty otherwise. */
    scopes: string[];
};
/**
 * One alternative in the security requirement list.
 * All schemes within a group must be satisfied simultaneously (AND semantics).
 */
export type RequiredSecurityGroup = {
    schemes: RequiredSecurityScheme[];
};
export type RequiredSecurity = {
    state: RequiredSecurityState;
    /**
     * Each element is one alternative (OR semantics). Within each group, all schemes
     * must be satisfied simultaneously (AND semantics). Empty when `state === 'none'`.
     *
     * Mirrors the OpenAPI `security` array structure:
     * - outer array  → OR  (satisfy any one group)
     * - inner object → AND (all schemes in a group are required together)
     */
    requirements: RequiredSecurityGroup[];
};
/**
 * Determine whether an operation requires authentication, using `operation.security ?? document.security`
 * as the source of truth. Operation-level `security` fully overrides document-level — including `security: []`,
 * which explicitly opts the operation out of auth.
 *
 * OpenAPI encodes "auth is optional" by including an empty requirement object `{}`. Whenever `{}`
 * appears — whether alongside real requirements or as the only entry — auth is treated as optional (state: 'optional').
 */
export declare const getRequiredSecurity: (operation: Pick<OperationObject, "security"> | null | undefined, document: Pick<OpenApiDocument, "security" | "components">) => RequiredSecurity;
//# sourceMappingURL=get-required-security.d.ts.map