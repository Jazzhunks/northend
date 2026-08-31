import type { WorkspaceStore } from '../../client.js';
import type { OperationEvents } from '../../events/definitions/operation.js';
import type { WorkspaceDocument } from '../../schemas.js';
/**
 * Creates a new operation at a specific path and method in the document.
 * Automatically normalizes the path to ensure it starts with a slash.
 *
 * Returns the normalized path if successful, undefined otherwise.
 *
 * Example:
 * ```ts
 * createOperation(
 *   document,
 *   'users',
 *   'get',
 *   { tags: ['Users'] },
 * )
 * ```
 */
export declare const createOperation: (workspaceStore: WorkspaceStore | null, payload: OperationEvents["operation:create:operation"]) => string | undefined;
/**
 * Updates the `description` of an operation.
 * Safely no-ops if the document or operation does not exist.
 *
 * Example:
 * ```ts
 * updateOperationDescription(
 *   document,
 *   { meta: { method: 'get', path: '/users' }, payload: { description: 'Get a single user' },
 * })
 * ```
 */
export declare const updateOperationMeta: (store: WorkspaceStore | null, document: WorkspaceDocument | null, { meta, payload }: OperationEvents["operation:update:meta"]) => void;
/**
 * Updates the HTTP method and/or path of an operation and moves it to the new location.
 * This function:
 * 1. Moves the operation from the old method/path to the new method/path under paths
 * 2. Updates x-scalar-order to maintain the operation's position in the sidebar
 * 3. Syncs path parameters when the path changes
 *
 * Safely no-ops if nothing has changed, or if the document or operation does not exist.
 *
 * Example:
 * ```ts
 * updateOperationPathMethod({
 *   document,
 *   store,
 *   meta: { method: 'get', path: '/users' },
 *   payload: { method: 'post', path: '/api/users' },
 * })
 * ```
 */
export declare const updateOperationPathMethod: (document: WorkspaceDocument | null, store: WorkspaceStore | null, { meta, payload: { method, path }, blurTargetSelector, callback }: OperationEvents["operation:update:pathMethod"]) => void;
/**
 * Deletes an operation from the workspace
 *
 * Example:
 * ```ts
 * deleteOperation({
 *   document,
 *   meta: { method: 'get', path: '/users' },
 * })
 * ```
 */
export declare const deleteOperation: (workspace: WorkspaceStore | null, { meta, documentName }: OperationEvents["operation:delete:operation"]) => void;
/**
 * Adds an example name to the 'x-draft-examples' array for a specific operation in a document.
 *
 * - Finds the target operation using the provided path and method within the specified document.
 * - If the operation is found and has an 'x-draft-examples' array, pushes the new exampleName to it.
 * - Safely no-ops if the document or operation does not exist.
 */
export declare const createOperationDraftExample: (workspace: WorkspaceStore | null, { meta: { path, method }, documentName, exampleName }: OperationEvents["operation:create:draft-example"]) => void;
/**
 * Deletes an example with the given exampleKey from operation parameters and request body.
 *
 * - Finds the target operation within the specified document and path/method.
 * - Removes example values matching exampleKey from both parameter-level and content-level examples.
 * - Safely no-ops if the document, operation, or request body does not exist.
 */
export declare const deleteOperationExample: (workspace: WorkspaceStore | null, { meta: { path, method, exampleKey }, documentName }: OperationEvents["operation:delete:example"]) => void;
/**
 * Renames an example key for an operation across all operation-level example containers:
 * - `x-draft-examples`
 * - parameter-level examples
 * - parameter content-level examples
 * - request-body content examples
 * - request-body selected-content-type map
 *
 * If the target example name already exists in any container, this is a no-op to avoid
 * accidental data overwrites.
 */
export declare const renameOperationExample: (workspace: WorkspaceStore | null, { meta: { path, method, exampleKey }, documentName, payload }: OperationEvents["operation:rename:example"]) => void;
//# sourceMappingURL=operation.d.ts.map