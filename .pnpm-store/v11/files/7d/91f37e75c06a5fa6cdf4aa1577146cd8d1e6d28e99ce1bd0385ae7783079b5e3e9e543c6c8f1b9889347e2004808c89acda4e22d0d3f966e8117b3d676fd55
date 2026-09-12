import { type LoaderPlugin } from '@scalar/json-magic/bundle';
import { type Difference, merge } from '@scalar/json-magic/diff';
import type { PartialDeep } from 'type-fest';
import { type AuthStore } from './entities/auth/index.js';
import { type HistoryStore } from './entities/history/index.js';
import type { NavigationOptions } from './navigation/get-navigation-options.js';
import type { InMemoryWorkspace } from './schemas/inmemory-workspace.js';
import { type OpenApiDocument } from './schemas/v3.1/strict/openapi-document.js';
import type { DocumentMetaExtensions, Workspace, WorkspaceDocument, WorkspaceDocumentMeta, WorkspaceExtensions, WorkspaceMeta } from './schemas/workspace.js';
import type { WorkspaceSpecification } from './schemas/workspace-specification/index.js';
import type { WorkspacePlugin } from './workspace-plugin.js';
/**
 * Input type for workspace document metadata and configuration.
 * This type defines the required and optional fields for initializing a document in the workspace.
 */
type WorkspaceDocumentMetaInput = {
    /** Optional metadata about the document like title, description, etc */
    meta?: WorkspaceDocumentMeta;
    /** Required unique identifier for the document */
    name: string;
    /** Overrides for the document */
    overrides?: PartialDeep<OpenApiDocument>;
    /** Optional custom fetch implementation to use when retrieving the document. By default the global fetch implementation will be used */
    fetch?: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
};
/**
 * Represents a document that is loaded from a URL.
 * This type extends WorkspaceDocumentMetaInput to include URL-specific properties.
 */
export type UrlDoc = {
    /** URL to fetch the OpenAPI document from */
    url: string;
} & WorkspaceDocumentMetaInput;
/**
 * Represents a document that is loaded from a URL.
 * This type extends WorkspaceDocumentMetaInput to include URL-specific properties.
 */
export type FileDoc = {
    /** Path to the local file to read the OpenAPI document from */
    path: string;
} & WorkspaceDocumentMetaInput;
/** Represents a document that is provided directly as an object rather than loaded from a URL */
export type ObjectDoc = {
    /** The OpenAPI document object containing the API specification */
    document: Record<string, unknown>;
} & WorkspaceDocumentMetaInput;
/**
 * Union type representing the possible input formats for a workspace document:
 * - UrlDoc: Document loaded from a URL with optional fetch configuration
 * - ObjectDoc: Direct document object with metadata
 */
export type WorkspaceDocumentInput = UrlDoc | ObjectDoc | FileDoc;
/**
 * Configuration object for initializing a workspace store.
 * Defines the initial state and documents for the workspace.
 */
type WorkspaceProps = {
    /** Optional metadata for the workspace including theme, active document, etc */
    meta?: WorkspaceMeta;
    /** Fetch function for retrieving documents */
    fetch?: WorkspaceDocumentInput['fetch'];
    /**
     * Enables internal timing logs for workspace operations.
     * Disabled by default to avoid noisy console output.
     */
    verbose?: boolean;
    /** A list of all registered plugins for the current workspace */
    plugins?: WorkspacePlugin[];
    /** A file loader plugin for resolving local file references (for non browser environments) */
    fileLoader?: LoaderPlugin;
};
/**
 * Type definition for the workspace store return object.
 * This explicit type is needed to avoid TypeScript inference limits.
 *
 * @see https://github.com/microsoft/TypeScript/issues/43817#issuecomment-827746462
 */
export type WorkspaceStore = {
    /**
     * The history store for the workspace
     */
    readonly history: HistoryStore;
    /**
     * The auth store for the workspace
     */
    readonly auth: AuthStore;
    /**
     * Returns the reactive workspace object with an additional activeDocument getter
     */
    readonly workspace: Workspace;
    /**
     * Updates a specific metadata field in the workspace
     * @param key - The metadata field to update
     * @param value - The new value for the field
     * @example
     * // Update the workspace title
     * update('x-scalar-active-document', 'document-name')
     */
    update<K extends keyof WorkspaceMeta | keyof WorkspaceExtensions>(key: K, value: (WorkspaceMeta & WorkspaceExtensions)[K]): void;
    /**
     * Updates a specific metadata field for a given document in the workspace.
     * @param name - The document to update. Use 'active' for the currently active document, or provide a specific document name.
     * @param key - The metadata field to update, as defined in WorkspaceDocumentMeta.
     * @param value - The new value for the selected metadata field.
     * @returns true if the update was successful, false otherwise.
     * @example
     * // Update the selected server for the active document
     * updateDocument('active', 'x-scalar-selected-server', 'staging')
     * // Update the selected server for a specific document
     * updateDocument('document-name', 'x-scalar-selected-server', 'staging')
     */
    updateDocument<K extends keyof DocumentMetaExtensions>(name: 'active' | (string & {}), key: K, value: DocumentMetaExtensions[K]): boolean;
    /**
     * Replaces the content of a specific document in the workspace with the provided input.
     * This method computes the difference between the current document and the new input,
     * then applies only the necessary changes in place. The updates are applied atomically,
     * ensuring the document is updated in a single operation.
     *
     * @param documentName - The name of the document to update.
     * @param input - The new content to apply to the document (as a plain object).
     * @example
     * // Replace the content of the 'api' document with new data
     * store.replaceDocument('api', {
     *   openapi: '3.1.0',
     *   info: { title: 'Updated API', version: '1.0.1' },
     *   paths: {},
     * })
     */
    replaceDocument(documentName: string, input: Record<string, unknown>): Promise<void>;
    /**
     * Resolves a reference in the active document by following the provided path and resolving any external $ref references.
     * This method traverses the document structure following the given path and resolves any $ref references it encounters.
     * During resolution, it sets a loading status and updates the reference with the resolved content.
     *
     * @param path - Array of strings representing the path to the reference (e.g. ['paths', '/users', 'get', 'responses', '200'])
     * @throws Error if the path is invalid or empty
     * @example
     * // Resolve a reference in the active document
     * resolve(['paths', '/users', 'get', 'responses', '200'])
     */
    resolve(path: string[]): Promise<unknown>;
    /**
     * Adds a new document to the workspace
     * @param document - The document content to add. This should be a valid OpenAPI/Swagger document or other supported format
     * @param meta - Metadata for the document, including its name and other properties defined in WorkspaceDocumentMeta
     * @example
     * // Add a new OpenAPI document to the workspace
     * store.addDocument({
     *   name: 'name',
     *   document: {
     *     openapi: '3.0.0',
     *     info: { title: 'title' },
     *   },
     *   meta: {
     *     'x-scalar-selected-server': 'production'
     *   }
     * })
     */
    addDocument(input: WorkspaceDocumentInput, navigationOptions?: NavigationOptions): Promise<boolean>;
    /**
     * Deletes a document from the workspace and all associated data.
     *
     * This method removes the document from the workspace along with all related data including:
     * - The document itself from the workspace documents map
     * - Original document data
     * - Intermediate document data (saved local versions)
     * - Document-specific configuration
     * - Document overrides
     * - Extra document configurations
     *
     * If the deleted document was the active document, the active document is automatically
     * reset to the first remaining document in the workspace, or undefined if no documents remain.
     *
     * The deletion is automatically tracked by the workspace change detection system,
     * and appropriate events will be fired to notify registered plugins.
     *
     * @param documentName - The name of the document to delete
     * @returns void
     *
     * @example
     * // Delete the document named 'api'
     * store.deleteDocument('api')
     *
     * @example
     * // Delete multiple documents
     * ['api', 'petstore'].forEach(name => store.deleteDocument(name))
     */
    deleteDocument(documentName: string): void;
    /**
     * Exports the specified document in the requested format.
     *
     * This method serializes the most recently saved local version of the document (from the intermediateDocuments map)
     * to either JSON or YAML. The exported document reflects the last locally saved state, including any edits
     * that have been saved but not yet synced to a remote registry. Runtime/in-memory changes that have not been saved
     * will not be included.
     *
     * @param documentName - The name of the document to export.
     * @param format - The output format: 'json' for a JSON string, or 'yaml' for a YAML string.
     * @returns The document as a string in the requested format, or undefined if the document does not exist.
     *
     * @example
     * // Export a document as JSON
     * const jsonString = store.exportDocument('api', 'json')
     *
     * // Export a document as YAML
     * const yamlString = store.exportDocument('api', 'yaml')
     */
    exportDocument(documentName: string, format: 'json' | 'yaml', minify?: boolean): string | undefined;
    /**
     * Exports the currently active document in the requested format.
     *
     * This is a convenience method that exports the active document (determined by the workspace's
     * activeDocument extension) without requiring the caller to specify the document name.
     * The exported document reflects the last locally saved state, including any edits that have
     * been saved but not yet synced to a remote registry.
     *
     * @param format - The output format: 'json' for a JSON string, or 'yaml' for a YAML string.
     * @returns The active document as a string in the requested format, or undefined if no active document exists.
     *
     * @example
     * // Export the active document as JSON
     * const jsonString = store.exportActiveDocument('json')
     *
     * // Export the active document as YAML
     * const yamlString = store.exportActiveDocument('yaml')
     */
    exportActiveDocument(format: 'json' | 'yaml', minify?: boolean): string | undefined;
    /**
     * Returns the editable version of the specified document.
     *
     * @param documentName - The name of the document to get the editable version of.
     * @returns The editable version of the document, or undefined if the document does not exist.
     */
    getEditableDocument(documentName: string): Promise<WorkspaceDocument | null>;
    /**
     * Returns the original version of the specified document.
     *
     * The original version of the document is the version that was loaded from the source which means the original version that we know of when we started editing the document.
     *
     * @param documentName - The name of the document to get the original version of.
     * @returns The original version of the document, or undefined if the document does not exist.
     */
    getOriginalDocument(documentName: string): Record<string, unknown> | null;
    /**
     * Returns the intermediate version of the specified document.
     *
     * The intermediate version of the document is the version that was saved to the intermediate documents map.
     * It should be used to push a new version of the document to the remote registry.
     *
     * @param documentName - The name of the document to get the intermediate version of.
     * @returns The intermediate version of the document, or undefined if the document does not exist.
     *
     * @deprecated The intermediate document layer is being phased out. The
     *   workspace store now keeps only two snapshots per document: the original
     *   (last saved / loaded baseline) and the active in-memory state. Use
     *   `getOriginalDocument` to read the saved baseline. The `intermediateDocuments`
     *   map is no longer updated by `saveDocument` or `rebaseDocument` and only
     *   reflects the document as it was first loaded into the workspace.
     */
    getIntermediateDocument(documentName: string): Record<string, unknown> | null;
    /**
     * Saves the current state of the specified document as the new baseline.
     *
     * This function captures the latest (reactive) state of the document from
     * the workspace and writes a deep clone of it back into the
     * `originalDocuments` map - effectively promoting the in-memory state to
     * the new "last saved" snapshot. After saving, `getOriginalDocument`
     * returns the persisted edits and `revertDocumentChanges` rolls back to
     * exactly this state.
     *
     * The update is performed in-place. A deep clone of the current document
     * state is used to avoid mutating the reactive object directly. The
     * dirty flag (`x-scalar-is-dirty`) is cleared on success.
     *
     * @param documentName - The name of the document to save.
     * @returns `true` when the save succeeded, `false` if the document does
     *          not exist or cannot be serialised back into the original map.
     *
     * @example
     * // Save the current state of the document named 'api'
     * const isSuccess = await store.saveDocument('api')
     * if (isSuccess) {
     *   console.log('Document saved successfully')
     * } else {
     *   console.log('Failed to save document')
     * }
     */
    saveDocument(documentName: string): Promise<boolean>;
    /**
     * Builds the sidebar for the specified document.
     *
     * @param documentName - The name of the document to build the sidebar for
     * @returns boolean indicating if the sidebar was built successfully
     */
    buildSidebar: (documentName: string) => boolean;
    /**
     * Restores the specified document to its last locally saved state.
     *
     * This method updates the current reactive document (in the workspace)
     * with the contents of the corresponding original document (from the
     * `originalDocuments` map), effectively discarding any unsaved in-memory
     * changes and reverting to the last saved version. Vue reactivity is
     * preserved by updating the existing reactive object in place.
     *
     * **Warning:** This operation will discard all unsaved (in-memory) changes to the specified document.
     *
     * @param documentName - The name of the document to restore.
     * @returns void
     *
     * @example
     * // Restore the document named 'api' to its last saved state
     * store.revertDocumentChanges('api')
     */
    revertDocumentChanges(documentName: string): Promise<void>;
    /**
     * Promotes the intermediate document to the original document for the given document name.
     *
     * The intermediate document (last locally saved version) becomes the new baseline/original.
     * Use this after syncing or merging when the current intermediate state should be treated
     * as the new known source (e.g. after resolving rebase conflicts and applying changes).
     *
     * @param documentName - The name of the document to update.
     * @returns boolean indicating if the intermediate document was promoted to the original document.
     * @example
     * // Promote the intermediate document to the original document
     * const result = store.promoteIntermediateToOriginal('api')
     * if (result) {
     *   console.log('Intermediate document promoted to original document')
     * } else {
     *   console.log('Intermediate document does not exist')
     * }
     *
     * @deprecated The intermediate document layer is being phased out.
     *   `saveDocument` already writes directly to `originalDocuments`, so this
     *   method has no remaining responsibility once the intermediate map stops
     *   being updated. It is kept for API compatibility and will be removed in
     *   a future release.
     */
    promoteIntermediateToOriginal(documentName: string): boolean;
    /**
     * Commits the specified document.
     *
     * This method is intended to finalize and persist the current state of the document,
     * potentially syncing it with a remote registry or marking it as the latest committed version.
     *
     * @param documentName - The name of the document to commit.
     * @remarks
     * The actual commit logic is not implemented yet.
     */
    commitDocument(documentName: string): void;
    /**
     * Exports the complete current workspace state as a plain JavaScript object.
     *
     * The returned object includes all workspace documents (with Vue reactivity removed), workspace metadata,
     * document configurations, and both the original and intermediate document maps. This object can be
     * serialized (e.g., with JSON.stringify) and later imported to fully restore the workspace—including
     * all documents, their configurations, metadata, and historical states.
     *
     * @returns An `InMemoryWorkspace` object representing the entire workspace state,
     *          suitable for persistence, backup, or sharing.
     */
    exportWorkspace(): InMemoryWorkspace;
    /**
     * Imports a workspace from a serialized JSON string.
     *
     * Replaces the current workspace state — documents, metadata, and
     * configuration — with the imported values.
     *
     * @param input - The serialized workspace JSON string to import.
     */
    loadWorkspace(input: InMemoryWorkspace): void;
    /**
     * Imports a workspace from a WorkspaceSpecification object.
     *
     * This method assigns workspace metadata and adds all documents defined in the specification.
     * Each document is added using its $ref and optional overrides.
     *
     * @example
     * ```ts
     * await store.importWorkspaceFromSpecification({
     *   documents: {
     *     api: { $ref: '/specs/api.yaml' },
     *     petstore: { $ref: '/specs/petstore.yaml' }
     *   },
     *   overrides: {
     *     api: { config: { features: { showModels: true } } }
     *   },
     *   info: { title: 'My Workspace' },
     *   workspace: 'v1',
     *   "x-scalar-color-mode": true
     * })
     * ```
     *
     * @param specification - The workspace specification to import.
     */
    importWorkspaceFromSpecification(specification: WorkspaceSpecification): Promise<boolean[]>;
    /**
     * Rebases a document in the workspace by refetching its origin and merging with local edits.
     *
     * This method fetches the latest version of the document (optionally with custom fetch/config),
     * calculates changes relative to the original and locally edited versions,
     * and attempts to update the workspace document while preserving user edits.
     * If automatic resolution isn't possible due to conflicts, returns a conflict list for the caller to resolve.
     * If `resolvedConflicts` are provided (e.g., after user intervention), applies them to complete the rebase.
     *
     * @param input Object specifying which document to rebase
     * @returns If there are unresolved conflicts, resolves to an object containing the list of conflicts and a method to apply user-resolved conflicts; otherwise resolves to void.
     *
     * @example
     * // Rebase a document and handle conflicts interactively
     * const result = await store.rebaseDocument({ name: 'api', fetch: customFetch });
     * if (result && result.ok) {
     *   // Present conflicts to the user and collect resolutions...
     *   await result.applyChanges(userResolvedConflicts);
     * }
     */
    rebaseDocument: (input: WorkspaceDocumentInput) => Promise<{
        ok: false;
        type: 'CORRUPTED_STATE' | 'FETCH_FAILED' | 'NO_CHANGES_DETECTED';
        message: string;
    } | {
        ok: true;
        changes: ReturnType<typeof merge>['diffs'];
        conflicts: ReturnType<typeof merge>['conflicts'];
        applyChanges: (applyChangesInput: {
            resolvedConflicts: Difference<unknown>[];
        } | {
            resolvedDocument: Record<string, unknown>;
        }) => Promise<void>;
    }>;
};
/**
 * Creates a reactive workspace store that manages documents and their metadata.
 * The store provides functionality for accessing, updating, and resolving document references.
 *
 * @param workspaceProps - Configuration object for the workspace
 * @param workspaceProps.meta - Optional metadata for the workspace
 * @param workspaceProps.documents - Optional record of documents to initialize the workspace with
 *  Documents that require asynchronous loading must be added using `1` after the store is created
 *  this allows atomic awaiting and does not block page load for the store initialization
 * @returns An object containing methods and getters for managing the workspace
 */
export declare const createWorkspaceStore: (workspaceProps?: WorkspaceProps) => WorkspaceStore;
export { generateClientMutators } from './mutators/index.js';
//# sourceMappingURL=client.d.ts.map