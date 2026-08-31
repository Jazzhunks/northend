import type { NavigationOptions } from './navigation/get-navigation-options.js';
import { type OpenApiDocument, type OperationObject, type PathsObject } from './schemas/v3.1/strict/openapi-document.js';
import type { Workspace, WorkspaceDocumentMeta, WorkspaceMeta } from './schemas/workspace.js';
export declare const WORKSPACE_FILE_NAME = "scalar-workspace.json";
type WorkspaceDocumentMetaInput = {
    name: string;
    meta?: WorkspaceDocumentMeta;
};
type UrlDoc = {
    url: string;
} & WorkspaceDocumentMetaInput;
type FileDoc = {
    path: string;
} & WorkspaceDocumentMetaInput;
type ObjectDoc = {
    document: Record<string, unknown>;
} & WorkspaceDocumentMetaInput;
type WorkspaceDocumentInput = UrlDoc | ObjectDoc | FileDoc;
type CreateServerWorkspaceStoreBase = {
    documents: WorkspaceDocumentInput[];
    meta?: WorkspaceMeta;
    navigationOptions?: NavigationOptions;
};
type CreateServerWorkspaceStoreProps = ({
    directory?: string;
    mode: 'static';
} & CreateServerWorkspaceStoreBase) | ({
    baseUrl: string;
    mode: 'ssr';
} & CreateServerWorkspaceStoreBase);
/**
 * Filters an OpenAPI PathsObject to only include standard HTTP methods.
 * Removes any vendor extensions or other non-HTTP properties.
 *
 * @param paths - The OpenAPI PathsObject to filter
 * @returns A new PathsObject containing only standard HTTP methods
 *
 * @example
 * Input: {
 *   "/users": {
 *     "get": {...},
 *     "x-custom": {...},
 *     "post": {...}
 *   }
 * }
 * Output: {
 *   "/users": {
 *     "get": {...},
 *     "post": {...}
 *   }
 * }
 */
export declare function filterHttpMethodsOnly(paths: PathsObject): Record<string, Record<string, OperationObject>>;
/**
 * Escapes path keys in an OpenAPI PathsObject to be JSON Pointer compatible.
 * This is necessary because OpenAPI paths can contain characters that need to be escaped
 * when used as JSON Pointer references (like '/' and '~').
 *
 * @example
 * Input: { "/users/{id}": { ... } }
 * Output: { "/users~1{id}": { ... } }
 */
export declare function escapePaths(paths: Record<string, Record<string, OperationObject>>): Record<string, Record<string, OperationObject>>;
/**
 * Externalizes components by turning them into refs.
 */
export declare function externalizeComponentReferences(document: OpenApiDocument, meta: {
    mode: 'ssr';
    name: string;
    baseUrl: string;
} | {
    mode: 'static';
    name: string;
    directory: string;
}): Record<string, any>;
/**
 * Externalizes paths operations by turning them into refs.
 */
export declare function externalizePathReferences(document: OpenApiDocument, meta: {
    mode: 'ssr';
    name: string;
    baseUrl: string;
} | {
    mode: 'static';
    name: string;
    directory: string;
}): Record<string, any>;
type ServerWorkspace = Omit<Workspace, 'activeDocument'>;
/**
 * Server workspace store interface
 */
export type ServerWorkspaceStore = {
    /**
     * Loads and registers a document in the workspace.
     *
     * Supported inputs include:
     * - `url`: fetch and parse an OpenAPI document from a remote URL
     * - `path`: read and parse an OpenAPI document from the filesystem
     * - `document`: use an in-memory OpenAPI object directly
     *
     * If loading fails, the document is not added.
     *
     * @example
     * ```ts
     * await store.addDocument({
     *   url: 'https://example.com/openapi.json',
     *   name: 'petstore',
     * })
     *
     * await store.addDocument({
     *   path: './specs/billing.yaml',
     *   name: 'billing',
     * })
     * ```
     *
     * @param input - Source and metadata used to load and register the document
     */
    addDocument: (input: WorkspaceDocumentInput, navigationOptions?: NavigationOptions) => Promise<void>;
    /**
     * Generates chunk files for all loaded documents.
     *
     * Only available in `static` mode. Writes chunk files for:
     * - workspace metadata
     * - components (schemas, parameters, responses, etc.)
     * - operations (grouped by path and HTTP method)
     *
     * After generation, workspace references point to relative file paths.
     *
     * @example
     * ```ts
     * const store = await createServerWorkspaceStore({
     *   mode: 'static',
     *   outputPath: './dist/workspace',
     *   meta: { title: 'Docs' },
     * })
     *
     * await store.generateWorkspaceChunks()
     * ```
     *
     * @throws {Error} If called when mode is not 'static'
     */
    generateWorkspaceChunks: () => Promise<void>;
    /**
     * Returns the current workspace payload.
     *
     * The payload contains workspace metadata plus sparse documents whose heavy
     * sections are replaced by references:
     * - in `ssr` mode, references resolve from in-memory assets
     * - in `static` mode, references point to generated chunk files
     *
     * @example
     * ```ts
     * const workspace = store.getWorkspace()
     *
     * // Read available document names
     * const names = Object.keys(workspace.documents)
     * ```
     *
     * @returns Workspace metadata and document references used by the client
     */
    getWorkspace: () => ServerWorkspace;
    /**
     * Resolves a chunk by JSON Pointer.
     *
     * Pointers can target component and operation chunks for loaded documents.
     * Returns `undefined` when the pointer does not resolve.
     *
     * @example
     * ```ts
     * // Resolve a component chunk
     * const userSchema = store.get('#/petstore/components/schemas/User')
     *
     * // Resolve an operation chunk
     * const listPets = store.get('#/petstore/operations/pets/get')
     * ```
     *
     * @param pointer - JSON Pointer to the desired chunk
     * @returns The resolved chunk, or `undefined` when not found
     */
    get: (pointer: string) => unknown;
};
/**
 * Create server state workspace store
 */
export declare function createServerWorkspaceStore(workspaceProps: CreateServerWorkspaceStoreProps): Promise<ServerWorkspaceStore>;
export {};
//# sourceMappingURL=server.d.ts.map