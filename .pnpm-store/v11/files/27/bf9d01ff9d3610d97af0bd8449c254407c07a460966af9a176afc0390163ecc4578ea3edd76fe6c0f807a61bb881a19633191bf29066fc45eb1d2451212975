import type { AuthenticationConfiguration } from '@scalar/types/api-reference';
import type { WorkspaceStore } from '../../client.js';
import type { SelectedSecurity } from '../../entities/auth/index.js';
import type { AuthMeta, ServerMeta } from '../../events/index.js';
import type { SecuritySchemeObjectSecret } from '../../request-example/builder/security/secret-types.js';
import { type Layout } from '../../request-example/context/proxy.js';
import { type MergedSecuritySchemes } from '../../request-example/context/security/merge-security.js';
import type { RequestExampleMeta, Result } from '../../request-example/types.js';
import type { XScalarEnvironment } from '../../schemas/extensions/document/x-scalar-environments.js';
import type { XScalarCookie } from '../../schemas/extensions/general/x-scalar-cookies.js';
import type { OperationObject } from '../../schemas/v3.1/strict/operation.js';
import type { SecurityRequirementObject } from '../../schemas/v3.1/strict/security-requirement.js';
import type { ServerObject } from '../../schemas/v3.1/strict/server.js';
import type { WorkspaceDocument } from '../../schemas/workspace.js';
export type BuildRequestExampleContext = {
    operation: OperationObject;
    environment: {
        name: string | null;
        environment: XScalarEnvironment;
    };
    cookies: {
        workspace: XScalarCookie[];
        document: XScalarCookie[];
    };
    servers: {
        list: ServerObject[];
        selected: ServerObject | null;
        meta: ServerMeta;
    };
    proxy: {
        url: string | null;
    };
    headers: {
        default: Record<string, string>;
    };
    security: {
        schemes: MergedSecuritySchemes;
        requirements: SecurityRequirementObject[];
        selected: SelectedSecurity;
        selectedSchemes: SecuritySchemeObjectSecret[];
        meta: AuthMeta;
    };
};
export declare const getRequestExampleContext: (workspaceStore: WorkspaceStore, documentName: string, requestExampleMeta: RequestExampleMeta, options?: Partial<{
    servers: ServerObject[];
    baseServerUrl: string;
    layout: Layout;
    appVersion: string;
    isElectron: boolean;
    /** User facing authentication configuration */
    authentication: AuthenticationConfiguration;
    /**
     * When the document is not in `workspace.documents[documentName]` yet, use this copy (same shape as the
     * workspace entry). Callers that already hold the resolved document should pass it so behavior matches
     * reading from props.
     */
    fallbackDocument: WorkspaceDocument | null;
}>) => Result<BuildRequestExampleContext>;
//# sourceMappingURL=get-request-example-context.d.ts.map