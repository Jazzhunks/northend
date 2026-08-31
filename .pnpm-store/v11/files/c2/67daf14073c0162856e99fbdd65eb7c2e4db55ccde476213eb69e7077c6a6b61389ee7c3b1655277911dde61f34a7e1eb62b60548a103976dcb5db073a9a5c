import type { OperationTitleSource, TagsMap, TraverseSpecOptions } from '../../navigation/types.js';
import type { TraversedOperation } from '../../schemas/navigation.js';
import type { OpenApiDocument, OperationObject } from '../../schemas/v3.1/strict/openapi-document.js';
export declare const isDeprecatedOperation: (operation: OperationObject) => boolean;
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
export declare const traversePaths: ({ document, tagsMap, generateId, documentId, operationTitleSource, }: {
    document: OpenApiDocument;
    /** Map of tags and their entries */
    tagsMap: TagsMap;
    /** Function used to generate unique IDs for operations */
    generateId: TraverseSpecOptions["generateId"];
    /** Document ID */
    documentId: string;
    /** Whether to use the operation summary or the operation path for sidebar titles */
    operationTitleSource?: OperationTitleSource;
}) => {
    untaggedOperations: TraversedOperation[];
};
//# sourceMappingURL=traverse-paths.d.ts.map