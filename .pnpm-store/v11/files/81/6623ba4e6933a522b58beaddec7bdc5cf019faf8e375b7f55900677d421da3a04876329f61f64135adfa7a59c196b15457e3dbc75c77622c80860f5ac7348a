import type { ParameterObject } from '../../../schemas/v3.1/strict/parameter.js';
import type { ReferenceType } from '../../../schemas/v3.1/strict/reference.js';
export type MinimalParameterObject = Pick<ParameterObject, 'name' | 'in'>;
/**
 * Synchronizes path parameters when a path string changes.
 *
 * Behavior:
 * - Preserves as much of the existing parameter configuration as possible when the set of path variables
 *   changes due to a path update.
 * - If a parameter with the same name exists in the new path, its configuration is preserved.
 * - If a parameter appears at the same position as an old parameter (name changed), the old parameter's
 *   configuration is kept and its name is updated in place via the resolved object.
 * - Any newly required parameters (variables present in the new path but not in the old path) are added
 *   as new minimal parameter objects.
 * - Parameters that are no longer present in the new path are dropped.
 * - Non-path parameters (query, header, etc.) from `existingParameters` are included unchanged in the result.
 *
 * ⚠️ This function mutates parameter objects in the `existingParameters` array in place when a path
 *     parameter is renamed (i.e., reused objects may have their `name` updated via `resolve`).
 *
 * Returns the full new parameters array. Use the return value directly as the new operation.parameters.
 *
 * @param newPath - The path string after the change (e.g. '/users/{id}/posts/{postId}').
 * @param oldPath - The path string before the change (e.g. '/users/{userId}').
 * @param existingParameters - Current operation parameters (may be refs); path params are synced, others passed through.
 * @param resolve - Callback to resolve a reference to a minimal parameter object (used for reading and mutating).
 *
 * @example
 * ```ts
 * // Given:
 * // - oldPath: '/users/{userId}'
 * // - newPath: '/users/{id}/posts/{postId}'
 * // - existingParameters: [ { name: 'userId', in: 'path' } ]
 *
 * const newParams = syncParametersForPathChange(
 *   '/users/{id}/posts/{postId}',
 *   '/users/{userId}',
 *   existingParameters,
 *   (node) => resolveRef(node) // or unwrap $ref to get { name, in }
 * )
 *
 * // existingParameters[0] was mutated in place (name -> 'id' via resolve).
 * // newParams is the full array: [ renamed path param 'id', new path param 'postId' ]
 *
 * operation.parameters = newParams
 * ```
 */
export declare const syncParametersForPathChange: <T extends MinimalParameterObject>(newPath: string, oldPath: string, existingParameters: ReferenceType<T>[], resolve: (node: ReferenceType<T>) => MinimalParameterObject) => ReferenceType<T>[];
//# sourceMappingURL=sync-path-parameters.d.ts.map