import type { PartialDeep } from 'type-fest';
import { type DocumentAuth, type SecretsAuthUnion, type SelectedSecurity } from '../../entities/auth/schema.js';
export type { Auth, SecretsApiKey, SecretsAuth, SecretsAuthUnion, SecretsHttp, SecretsOAuth, SecretsOAuthFlows, SecretsOpenIdConnect, SelectedSecurity, } from './schema.js';
export { AuthSchema, OpenIDConnectSchema, SecretsAuthSchema, } from './schema.js';
/**
 * Interface for the AuthStore used to manage authentication secrets and selection state.
 */
export type AuthStore = {
    /**
     * Retrieves the authentication secrets for a given document and security scheme.
     * @param documentName - Name/id of the OpenAPI document.
     * @param schemeName - Name of the security scheme.
     * @returns The authentication secrets, or undefined if not found.
     */
    getAuthSecrets: (documentName: string, schemeName: string) => SecretsAuthUnion | undefined;
    /**
     * Retrieves the selected schemas for a given document or path.
     * @param payload - The payload to get the selected schemas for.
     * @returns The selected schemas, or undefined if not found.
     */
    getAuthSelectedSchemas: (payload: {
        type: 'document';
        documentName: string;
    } | {
        type: 'operation';
        documentName: string;
        path: string;
        method: string;
    }) => SelectedSecurity | undefined;
    /**
     * Sets the selected schemas for a given document or path.
     * @param payload - The payload to set the selected schemas for.
     * @param selectedSchemes - The selected schemas to set.
     */
    setAuthSelectedSchemas: (payload: {
        type: 'document';
        documentName: string;
    } | {
        type: 'operation';
        documentName: string;
        path: string;
        method: string;
    }, selectedSchemes: SelectedSecurity) => void;
    /**
     * Clears the selected schemas for a given document or path.
     * @param payload - The payload to clear the selected schemas for.
     */
    clearAuthSelectedSchemas: (payload: {
        type: 'document';
        documentName: string;
    } | {
        type: 'operation';
        documentName: string;
        path: string;
        method: string;
    }) => void;
    /**
     * Sets the authentication secrets for a given document and security scheme.
     * @param documentName - Name/id of the OpenAPI document.
     * @param schemeName - Name of the security scheme.
     * @param auth - The secret/auth object to set.
     */
    setAuthSecrets: (documentName: string, schemeName: string, auth: PartialDeep<SecretsAuthUnion>) => void;
    /**
     * Clears the authentication secrets for a given document and security scheme.
     * @param documentName - Name/id of the OpenAPI document.
     * @param schemeName - Name of the security scheme.
     */
    clearAuthSecrets: (documentName: string, schemeName: string) => void;
    /**
     * Removes the authentication data for a given document.
     * @param documentName - Name/id of the OpenAPI document.
     */
    clearDocumentAuth: (documentName: string) => void;
    /**
     * Loads authentication data into the store, replacing existing state.
     * @param data - A DocumentAuth object.
     */
    load: (data: DocumentAuth) => void;
    /**
     * Exports the current authentication state as a plain (non-proxy) DocumentAuth object.
     * @returns The authentication state.
     */
    export: () => DocumentAuth;
};
type CreateAuthStoreOptions = {
    hooks?: {
        onAuthChange?: (documentName: string) => void;
    };
};
/**
 * Factory function to create a new AuthStore instance.
 */
export declare const createAuthStore: ({ hooks }?: CreateAuthStoreOptions) => AuthStore;
//# sourceMappingURL=index.d.ts.map