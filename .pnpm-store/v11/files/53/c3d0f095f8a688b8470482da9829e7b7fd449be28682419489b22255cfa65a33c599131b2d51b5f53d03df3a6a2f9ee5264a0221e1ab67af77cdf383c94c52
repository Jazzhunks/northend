import type { ServerObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document';
import type { WorkspaceDocument } from '../../schemas.js';
import type { OperationObject } from '../../schemas/v3.1/strict/operation.js';
/**
 * Server processing options containing base URLs for resolving relative server URLs.
 */
type ServerProcessingOptions = {
    baseServerUrl?: string;
    documentUrl?: string;
};
/**
 * Retrieves and processes servers from an OpenAPI document.
 *
 * This function handles several scenarios:
 * 1. No servers provided - creates a default server from document URL or fallback
 * 2. Invalid server configurations - filters them out with warnings
 * 3. Relative URLs - resolves them to absolute URLs using available base URLs
 *
 * @param servers - Array of OpenAPI server objects from the document
 * @param options - Configuration options for server processing
 * @returns Array of validated Server entities
 */
export declare function getServers(servers: ServerObject[] | undefined, options?: ServerProcessingOptions): ServerObject[];
export declare const getSelectedServer: (document: WorkspaceDocument | null, operation: OperationObject | null, configServers: ServerObject[] | null, servers: ServerObject[]) => ServerObject | null;
export {};
//# sourceMappingURL=servers.d.ts.map