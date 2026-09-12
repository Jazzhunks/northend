import type { OperationEvents } from '../../events/definitions/operation.js';
import type { WorkspaceDocument } from '../../schemas.js';
/**
 * Sets the selected request-body content type for the current `exampleKey`.
 * This stores the selection under `x-scalar-selected-content-type` on the
 * resolved requestBody. Safely no-ops if the document or operation does not exist.
 *
 * Example:
 * ```ts
 * updateOperationRequestBodyContentType({
 *   document,
 *   meta: { method: 'post', path: '/upload', exampleKey: 'default' },
 *   payload: { contentType: 'multipart/form-data' },
 * })
 * ```
 */
export declare const updateOperationRequestBodyContentType: (document: WorkspaceDocument | null, { meta, payload }: OperationEvents["operation:update:requestBody:contentType"]) => void;
/**
 * Creates or updates a concrete example value for a specific request-body
 * `contentType` and `exampleKey`. Safely no-ops if the document or operation
 * does not exist.
 *
 * Example:
 * ```ts
 * updateOperationRequestBodyExample({
 *   document,
 *   contentType: 'application/json',
 *   meta: { method: 'post', path: '/users', exampleKey: 'default' },
 *   payload: { value: JSON.stringify({ name: 'Ada' }) },
 * })
 * ```
 */
export declare const updateOperationRequestBodyExample: (document: WorkspaceDocument | null, { meta, payload, contentType }: OperationEvents["operation:update:requestBody:value"]) => void;
/**
 * Stores the form data for the request body example
 *
 * This needs special handling as we store it as an array of objects with a schema type of object
 */
export declare const updateOperationRequestBodyFormValue: (document: WorkspaceDocument | null, { meta, payload, contentType }: OperationEvents["operation:update:requestBody:formValue"]) => void;
//# sourceMappingURL=body.d.ts.map