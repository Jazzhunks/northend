import { getPathItemOperation } from '../../helpers/for-each-path-item-operation.js';
import { getResolvedRef } from '../../helpers/get-resolved-ref.js';
import { mergeObjects } from '../../helpers/merge-object.js';
import { isOpenApiDocument } from '../../schemas/type-guards.js';
/**
 * Updates an extension of the operation
 *
 * @example
 * ```ts
 * updateOperationExtension({
 *   document,
 *   meta: { method: 'get', path: '/users' },
 *   payload: { 'x-post-response': 'console.log(response)' },
 * })
 * ```
 */
export const updateOperationExtension = (document, { meta, payload }) => {
    if (!isOpenApiDocument(document)) {
        return;
    }
    const operation = getResolvedRef(getPathItemOperation(document.paths?.[meta.path], meta.method));
    if (!operation) {
        return;
    }
    mergeObjects(operation, payload);
};
