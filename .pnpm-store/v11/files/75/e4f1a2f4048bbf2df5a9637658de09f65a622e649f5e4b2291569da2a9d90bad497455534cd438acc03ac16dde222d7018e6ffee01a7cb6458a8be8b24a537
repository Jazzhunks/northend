import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { WorkspaceStore } from '@scalar/workspace-store/client';
import { type Auth } from '@scalar/workspace-store/entities/auth';
import type { SecuritySchemeObjectSecret } from '@scalar/workspace-store/request-example';
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
export declare function getOperations(doc: Partial<OpenAPIV3_1.Document>): OperationObject[];
/** Generate document settings from workspace store. AsyncAPI docs are skipped — this feature is OpenAPI-native. */
export declare function createDocumentSettings(workspaceStore: WorkspaceStore): {
    [k: string]: {
        activeServer: import("@scalar/workspace-store/schemas/v3.1/strict/server").ServerObject | null;
        securitySchemes: SecuritySchemeObjectSecret[];
    };
};
/**
 * Provides an interface to store and retrieve authentication scheme
 * information in local storage, including both the available schemes and
 * the user's selected schemes.
 */
export declare const authStorage: () => {
    /**
     * Retrieves and coerces the authentication schemes stored in local storage.
     */
    getAuth: (slug: string) => {
        secrets: {
            [x: string]: ({
                type: "apiKey";
            } & {
                'x-scalar-secret-token': string;
            }) | ({
                type: "http";
            } & {
                'x-scalar-secret-token': string;
            } & {
                'x-scalar-secret-username': string;
                'x-scalar-secret-password': string;
            }) | ({
                type: "oauth2";
            } & {
                password?: ({
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-username': string;
                    'x-scalar-secret-password': string;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
                implicit?: ({
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-redirect-uri': string;
                }) | undefined;
                clientCredentials?: ({
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
                authorizationCode?: ({
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-secret-redirect-uri': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
            }) | {
                password?: ({
                    refreshUrl: string;
                    scopes: {
                        [x: string]: string;
                    };
                } & {
                    'x-scalar-security-query'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-scalar-security-body'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-tokenName'?: string | undefined;
                } & {
                    'x-scalar-secret-auth-url'?: string | undefined;
                } & {
                    'x-scalar-secret-token-url'?: string | undefined;
                } & {
                    tokenUrl: string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                } & {
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-username': string;
                    'x-scalar-secret-password': string;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
                implicit?: ({
                    refreshUrl: string;
                    scopes: {
                        [x: string]: string;
                    };
                } & {
                    'x-scalar-security-query'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-scalar-security-body'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-tokenName'?: string | undefined;
                } & {
                    'x-scalar-secret-auth-url'?: string | undefined;
                } & {
                    'x-scalar-secret-token-url'?: string | undefined;
                } & {
                    authorizationUrl: string;
                } & {
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-redirect-uri': string;
                }) | undefined;
                clientCredentials?: ({
                    refreshUrl: string;
                    scopes: {
                        [x: string]: string;
                    };
                } & {
                    'x-scalar-security-query'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-scalar-security-body'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-tokenName'?: string | undefined;
                } & {
                    'x-scalar-secret-auth-url'?: string | undefined;
                } & {
                    'x-scalar-secret-token-url'?: string | undefined;
                } & {
                    tokenUrl: string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                } & {
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
                authorizationCode?: ({
                    refreshUrl: string;
                    scopes: {
                        [x: string]: string;
                    };
                } & {
                    'x-scalar-security-query'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-scalar-security-body'?: {
                        [x: string]: string;
                    } | undefined;
                } & {
                    'x-tokenName'?: string | undefined;
                } & {
                    'x-scalar-secret-auth-url'?: string | undefined;
                } & {
                    'x-scalar-secret-token-url'?: string | undefined;
                } & {
                    authorizationUrl: string;
                    tokenUrl: string;
                } & {
                    'x-usePkce': "SHA-256" | "plain" | "no";
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                } & {
                    'x-scalar-secret-client-id': string;
                } & {
                    'x-scalar-secret-token': string;
                } & {
                    'x-scalar-secret-refresh-token'?: string | undefined;
                } & {
                    'x-scalar-secret-client-secret': string;
                } & {
                    'x-scalar-secret-redirect-uri': string;
                } & {
                    'x-scalar-credentials-location'?: "header" | "body" | undefined;
                }) | undefined;
                type: "openIdConnect";
            };
        };
        selected: {
            path?: {
                [x: string]: {
                    [x: string]: {
                        selectedIndex: number;
                        selectedSchemes: {}[];
                    };
                };
            } | undefined;
            document?: {
                selectedIndex: number;
                selectedSchemes: {}[];
            } | undefined;
        };
    };
    /**
     * Stores the authentication schemes in local storage.
     * @param value The Auth object to stringify and store.
     */
    setAuth: (slug: string, value: Auth) => void;
};
/**
 * Restores authentication secrets from local storage to the workspace store.
 *
 * This function iterates through stored authentication schemes and restores
 * any secret values (keys starting with x-scalar-secret-) to the active
 * document's security schemes. It uses the current security schemes as the
 * source of truth, only restoring secrets for structures that exist in the
 * current document.
 */
export declare const restoreAuthSecretsFromStorage: ({ documentName, workspaceStore, }: {
    documentName: string;
    workspaceStore: WorkspaceStore;
}) => void;
export declare function safeParseJson(value: string): any;
//# sourceMappingURL=helpers.d.ts.map