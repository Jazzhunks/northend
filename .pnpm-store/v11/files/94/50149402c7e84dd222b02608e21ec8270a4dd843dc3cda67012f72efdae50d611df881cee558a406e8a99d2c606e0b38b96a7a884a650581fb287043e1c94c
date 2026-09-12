import { escapeJsonPointer } from '@scalar/json-magic/helpers/escape-json-pointer';
import { forEachPathItemOperation } from '../../helpers/for-each-path-item-operation.js';
import { getResolvedRef, mergeSiblingReferences } from '../../helpers/get-resolved-ref.js';
import { isHidden } from '../../helpers/is-hidden.js';
import { traverseOperationExamples } from '../../navigation/helpers/traverse-examples.js';
import { XScalarStabilityValues } from '../../schemas/extensions/operation/index.js';
import { getTag } from './get-tag.js';
export const isDeprecatedOperation = (operation) => {
    return operation.deprecated || operation['x-scalar-stability'] === XScalarStabilityValues.Deprecated;
};
/**
 * Creates a traversed operation entry from an OpenAPI operation object.
 *
 * @param ref - JSON pointer reference to the operation in the OpenAPI document
 * @param operation - The OpenAPI operation object
 * @param method - HTTP method of the operation
 * @param path - API path of the operation, defaults to 'Unknown'
 * @param tag - Tag object associated with the operation
 * @param entitiesMap - Map to store operation IDs and titles for mobile header navigation
 * @param getOperationId - Function to generate unique IDs for operations
 * @returns A traversed operation entry with ID, title, path, method and reference
 */
const createOperationEntry = ({ ref, operation, method, path, generateId, parentId, parentTag, operationTitleSource, }) => {
    const id = generateId({
        type: 'operation',
        operation,
        parentTag,
        method: method,
        path: path,
        parentId: parentId,
    });
    const title = operationTitleSource === 'path' ? path : operation.summary?.trim() ? operation.summary : path;
    const isDeprecated = isDeprecatedOperation(operation);
    const examples = traverseOperationExamples(operation).map((example) => ({
        type: 'example',
        id: generateId({
            type: 'example',
            parentId: id,
            name: example,
        }),
        title: example,
        name: example,
    }));
    const entry = {
        id,
        title,
        path,
        method,
        ref,
        type: 'operation',
        isDeprecated,
        children: examples.length ? examples : undefined,
    };
    return entry;
};
/**
 * Traverses the paths in an OpenAPI document to build a map of operations organized by tags.
 *
 * This function processes each path and its operations to:
 * - Filter out internal operations (marked with x-internal) and operations to ignore (marked with x-scalar-ignore)
 * - Group operations by their tags
 * - Collect operations without tags to be added at the document level
 * - Generate unique references and IDs for each operation
 *
 * TODO: filter out internal and scalar-ignore tags
 *
 * @param content - The OpenAPI document to traverse
 * @param tagsDict - Dictionary mapping tag names to their OpenAPI tag objects
 * @param entitiesMap - Map to store operation IDs and titles for mobile header navigation
 * @param getOperationId - Function to generate unique IDs for operations
 * @returns Object containing the tagsMap and an array of untagged operations
 */
export const traversePaths = ({ document, tagsMap, generateId, documentId, operationTitleSource, }) => {
    const untaggedOperations = [];
    // Traverse paths
    Object.entries(document.paths ?? {}).forEach(([path, pathItemRef]) => {
        forEachPathItemOperation(pathItemRef, (method, operationRef) => {
            const operation = getResolvedRef(operationRef, mergeSiblingReferences);
            if (!operation) {
                return;
            }
            // Skip if the operation is internal or scalar-ignore
            if (isHidden(operation)) {
                return;
            }
            const ref = `#/paths/${escapeJsonPointer(path)}/${method}`;
            // Traverse tags
            if (operation.tags?.length) {
                operation.tags.forEach((tagName) => {
                    const { tag, id: tagId } = getTag({
                        tagsMap,
                        name: tagName,
                        documentId,
                        generateId,
                    });
                    tagsMap.get(tagName)?.entries.push(createOperationEntry({
                        ref,
                        operation,
                        method,
                        path,
                        parentTag: { tag, id: tagId },
                        generateId,
                        parentId: tagId,
                        operationTitleSource,
                    }));
                });
            }
            else {
                // Collect operations without tags (no parentTag)
                untaggedOperations.push(createOperationEntry({
                    ref,
                    operation,
                    method,
                    path,
                    generateId,
                    parentId: documentId,
                    operationTitleSource,
                }));
            }
        });
    });
    return { untaggedOperations };
};
