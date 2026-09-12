import type { OperationEvents } from '../../events/definitions/operation.js';
import type { WorkspaceDocument } from '../../schemas.js';
/**
 * Updates an existing parameter of a given `type` by its index within that
 * type subset (e.g. the N-th query parameter). Supports updating name, value,
 * and enabled state for the targeted example.
 * Safely no-ops if the document, operation, or parameter does not exist.
 *
 * Example:
 * ```ts
 * updateOperationParameter({
 *   document,
 *   type: 'query',
 *   index: 0,
 *   meta: { method: 'get', path: '/search', exampleKey: 'default' },
 *   payload: { value: 'alice', isDisabled: false },
 * })
 * ```
 */
export declare const upsertOperationParameter: (document: WorkspaceDocument | null, { meta, type, payload, originalParameter }: OperationEvents["operation:upsert:parameter"]) => void;
/**
 * Updates the disabled state of a default parameter for an operation.
 * Default parameters are inherited from higher-level configurations (like collection or server defaults)
 * and this allows individual operations to selectively disable them without removing them entirely.
 *
 * The disabled state is stored in the `x-scalar-disable-parameters` extension object, organized by
 * parameter type and example key. Missing objects are initialized automatically.
 *
 * @param document - The current workspace document
 * @param type - The parameter type (e.g., 'header'). Determines the storage key ('default-headers' for headers)
 * @param meta.path - Path of the operation (e.g., '/users')
 * @param meta.method - HTTP method of the operation (e.g., 'get')
 * @param meta.exampleKey - Key identifying the relevant example
 * @param meta.key - The specific parameter key being updated
 * @param payload.isDisabled - Whether the parameter should be disabled
 */
export declare const updateOperationExtraParameters: (document: WorkspaceDocument | null, { type, meta, payload, in: location }: OperationEvents["operation:update:extra-parameters"]) => void;
/**
 * Removes a parameter from the operation OR path
 *
 * Example:
 * ```ts
 * deleteOperationParameter({
 *   document,
 *   originalParameter,
 *   meta: { method: 'get', path: '/users', exampleKey: 'default' },
 * })
 * ```
 */
export declare const deleteOperationParameter: (document: WorkspaceDocument | null, { meta, originalParameter }: OperationEvents["operation:delete:parameter"]) => void;
/**
 * Deletes all parameters of a given `type` from the operation.
 * Safely no-ops if the document or operation does not exist.
 *
 * Example:
 * ```ts
 * deleteAllOperationParameters({
 *   document,
 *   type: 'cookie',
 *   meta: { method: 'get', path: '/users' },
 * })
 * ```
 */
export declare const deleteAllOperationParameters: (document: WorkspaceDocument | null, { meta, type }: OperationEvents["operation:delete-all:parameters"]) => void;
//# sourceMappingURL=parameters.d.ts.map